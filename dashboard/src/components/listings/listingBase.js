import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import LinearProgress from "@material-ui/core/LinearProgress";

import ListingCard from "./listingCard";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "5px",
	},
	listings: {},
	formControl: {
		marginTop: "10px",
		marginBottom: "10px",
		paddingLeft: "15px",
	},
	refresh: {
		marginTop: "10px",
		marginBottom: "10px",
	},
	progress: {
		marginTop: "50px",
		height: "25px",
	},
	paper: {
		width: "90%",
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(10),
		marginBottom: theme.spacing(5),
	},
}));

const ListingBase = (props) => {
	const { listings, watchlist, onListingRefresh, onRefreshCancel } = props;
	const [state, setState] = useState({});
	const [filteredListings, setFilteredListings] = useState(listings);
	const [loading, setLoading] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		if (watchlist) {
			let temp = {};
			watchlist.map(({ tag, url }) => {
				temp = { ...temp, [tag]: false };
			});
			setState(temp);
		}
	}, [watchlist]);

	useEffect(() => {
		let triggered = false;
		Object.keys(state).forEach((key) => {
			triggered = triggered || state[key];
		});

		// warrant a filter
		if (triggered) {
			let temp = filteredListings;
			watchlist.forEach(({ id, tag }) => {
				// if checked then set the filtering
				if (state[tag]) {
					temp = temp.filter(({ url_id }) => url_id === id);
				}
			});
			setFilteredListings([...temp]);
		} else {
			setFilteredListings([...listings]);
		}
	}, [state]);

	useEffect(() => {
		if (listings) {
			setFilteredListings([...listings]);
		}
	}, [listings]);

	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.checked });
	};

	const handleRefreshClick = (event) => {
		setLoading(true);

		onListingRefresh(event)
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	// it does not actually cancel the request - flask still handles it entirely
	return (
		<Box className={classes.root}>
			<Box
				border={2}
				borderColor='primary.main'
				borderRadius='borderRadius'
			>
				<FormControl
					component='fieldset'
					className={classes.formControl}
				>
					<FormLabel component='legend'>Filter by tags</FormLabel>
					<FormGroup>
						{watchlist.map(({ tag, id }) => (
							<FormControlLabel
								control={
									<Checkbox
										checked={state[tag]}
										onChange={handleChange}
										name={tag}
									/>
								}
								label={tag}
								key={`tag-${id}`}
							/>
						))}
					</FormGroup>
				</FormControl>
			</Box>
			{loading ? (
				<Button
					variant='contained'
					color='primary'
					onClick={onRefreshCancel}
					className={classes.refresh}
				>
					<Typography>Cancel</Typography>
				</Button>
			) : (
				<Button
					variant='contained'
					color='primary'
					onClick={handleRefreshClick}
					className={classes.refresh}
				>
					<Typography>Refresh Listings</Typography>
				</Button>
			)}

			{loading ? (
				<>
					<Paper elevation={2} outlined className={classes.paper}>
						<Typography
							variant='h6'
							style={{ textAlign: "center" }}
						>
							Refreshing your listings with the current watchlist.
							Please Wait.
						</Typography>
						<LinearProgress
							variant='query'
							className={classes.progress}
						/>
					</Paper>
				</>
			) : (
				<Grid className={classes.listings} container spacing={2}>
					{filteredListings.map((listing) => (
						<Grid item key={listing.id}>
							<ListingCard listing={listing} />
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
};

export default ListingBase;

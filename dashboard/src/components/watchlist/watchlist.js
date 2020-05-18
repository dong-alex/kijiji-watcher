import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
	root: {
		textAlign: "center",
		marginTop: "15px",
		marginBottom: "15px",
	},
	list: {
		backgroundColor: theme.palette.background.paper,
	},
}));

const WatchList = (props) => {
	const { watchlist, onDeleteURL } = props;
	const classes = useStyles();
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [selectedID, setSelectedID] = useState(null);
	const [loading, setLoading] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [open, setOpen] = useState(false);

	// hover on the url to be deleted
	useEffect(() => {
		if (deleting) {
			return;
		}
	}, [selectedIndex, deleting]);

	const handleListItemClick = (e, index) => {
		setSelectedIndex(index);
	};

	const handleClose = () => {
		setOpen(!open);
	};

	const handleDialogOpen = (e, id) => {
		setOpen(true);
		setDeleting(true);
		setSelectedID(id);
	};

	const handleCancelDelete = (e) => {
		setSelectedID(null);
		setDeleting(false);
		setOpen(!open);
	};

	const handleConfirmDelete = (e) => {
		setLoading(true);
		onDeleteURL(selectedID).then((resp) => {
			setSelectedID(null);
			setDeleting(false);
			setOpen(!open);
			setLoading(false);
		});
	};

	return (
		<Box
			className={classes.root}
			border={2}
			borderColor='primary.main'
			borderRadius='borderRadius'
		>
			<List
				className={classes.list}
				subheader={
					<ListSubheader
						component='div'
						style={{ textAlign: "left", userSelect: "none" }}
					>
						Watchlisted URLs
					</ListSubheader>
				}
			>
				{watchlist.map(({ url, id, tag }, i) => (
					<ListItem
						button
						onClick={(e) => handleListItemClick(e, i)}
						selected={selectedIndex === i}
						key={id}
					>
						<ListItemText primary={`${tag} | ${url}`} />
						<ListItemSecondaryAction>
							<IconButton
								onClick={(e) => handleDialogOpen(e, id)}
								edge='end'
								aria-label='delete'
							>
								<DeleteIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				<Dialog onClose={handleClose} open={open}>
					<DialogTitle>Confirm URL Deletion</DialogTitle>
					<Button onClick={(e) => handleConfirmDelete(e)}>
						{loading ? (
							<CircularProgress size={24} />
						) : (
							<Typography>Yes</Typography>
						)}
					</Button>
					<Button onClick={(e) => handleCancelDelete(e)}>
						<Typography>No</Typography>
					</Button>
				</Dialog>
			</List>
		</Box>
	);
};

export default WatchList;

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormLabel";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
	textField: {
		width: "100%",
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2),
	},
}));

const AddForm = (props) => {
	const { onSubmitURL, urls } = props;
	const classes = useStyles();
	const [tagError, setTagError] = useState("");
	const [urlError, setURLError] = useState("");
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);
	const [tag, setTag] = useState("");
	const [watchlistURL, setWatchlistURL] = useState("");

	useEffect(() => {
		if (error) {
			setOpen(true);
		}
	}, [error]);

	const isUnique = () => {
		if (
			urls.some((watchlistEntry) => watchlistURL === watchlistEntry.url)
		) {
			setURLError(
				"The Kijiji URL exists in the watchlist already. Please enter a unique URL."
			);
			return false;
		}

		if (urls.some((watchlistEntry) => tag === watchlistEntry.tag)) {
			setTagError(
				"The tag exists in the watchlist already. Please enter a unique tag."
			);
			return false;
		}
		return true;
	};

	const resetErrors = () => {
		setTagError("");
		setURLError("");
	};

	const resetForm = () => {
		setWatchlistURL("");
		setTag("");
	};

	const validEntry = () => {
		if (tag === "") {
			setTagError("Please enter a valid unique tag to track your URL");
		}

		if (watchlistURL === "") {
			setURLError("Please enter a valid Kijiji URL");
		}

		if (isUnique()) {
			return true;
		}

		// would need to check if it is an actual Kijiji URL
	};

	const handleSubmitForm = (event) => {
		resetErrors();

		if (!validEntry()) {
			return;
		}

		if (watchlistURL === "") {
			setURLError("Please enter a Kijiji URL and try again.");
		} else if (!isUnique()) {
			console.log("Is not unique");
			setURLError(
				"The URL you entered has already been added. Please add a unique URL."
			);
		} else if (tag === "") {
			setTagError("Please enter a tag name");
		} else {
			onSubmitURL(event, watchlistURL, tag)
				.then(() => {
					resetForm();
				})
				.catch(() => {
					setError(
						"There was an error with your submission - please try again."
					);
				});
		}
	};

	const handleURLChange = (event) => {
		setWatchlistURL(event.target.value);
	};

	const handleTagChange = (event) => {
		setTag(event.target.value);
	};

	return (
		<FormControl noValidate>
			<FormLabel>Add a URL</FormLabel>
			<Collapse in={open}>
				<Alert
					severity='error'
					action={
						<IconButton
							aria-label='close'
							color='inherit'
							size='small'
							onClick={() => {
								setOpen(false);
								setError("");
							}}
						>
							<CloseIcon fontSize='inherit' />
						</IconButton>
					}
				>
					{error}
				</Alert>
			</Collapse>
			<TextField
				error={!!urlError}
				label='Watchlist URL'
				className={classes.textField}
				onChange={handleURLChange}
				value={watchlistURL}
				helperText={!!urlError && urlError}
			/>
			<TextField
				error={!!tagError}
				label='Watchlist Tag - Track'
				className={classes.textField}
				onChange={handleTagChange}
				value={tag}
				helperText={!!tagError && tagError}
			/>
			<Button
				variant='contained'
				color='primary'
				onClick={handleSubmitForm}
			>
				Submit
			</Button>
		</FormControl>
	);
};

export default AddForm;

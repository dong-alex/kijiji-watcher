import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormLabel";
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
	const { onSubmitURL } = props;
	const classes = useStyles();
	const [tagError, setTagError] = useState(false);
	const [tag, setTag] = useState("");
	const [watchlistURL, setWatchlistURL] = useState("");

	const handleSubmitForm = (event) => {
		if (tag === "") {
			setTagError(true);
		} else {
			onSubmitURL(event, watchlistURL, tag).then(() => {
				setTag("");
				setWatchlistURL("");
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
			<TextField
				label='Watchlist URL'
				className={classes.textField}
				onChange={handleURLChange}
				value={watchlistURL}
				helperText='Enter the full Kijiji URL'
			/>
			<TextField
				error={tagError}
				label='Watchlist Tag - Track'
				className={classes.textField}
				onChange={handleTagChange}
				value={tag}
				helperText='Please enter a valid tag to track your listings'
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

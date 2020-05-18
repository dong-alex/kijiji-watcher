import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
	},
	description: {
		fontSize: theme.typography.pxToRem(15),
	},
	media: {
		height: 0,
		paddingTop: "56.25%", // 16:9
		"&:hover": {
			opacity: 0.4,
		},
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
	avatar: {
		backgroundColor: red[500],
	},
}));

const AdCard = (props) => {
	const { listing } = props;
	const {
		id,
		image_url,
		link,
		description,
		location,
		posted,
		price,
		title,
		used,
		details,
	} = listing;

	const LIMIT_SPACE = 200;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const getLastWord = (string) => {
		for (let i = LIMIT_SPACE; i > 0; i--) {
			if (string[i] === " ") {
				return i;
			}
		}
	};

	const LIMIT = getLastWord(description);

	const redirectUser = () => {
		window.open(link, "_blank");
	};

	return (
		<Card className={classes.root}>
			<CardHeader
				avatar={
					<Avatar aria-label='recipe' className={classes.avatar}>
						{used ? "U" : "NEW"}
					</Avatar>
				}
				action={
					<IconButton aria-label='settings'>
						<MoreVertIcon />
					</IconButton>
				}
				title={`${title} | ${price ? price : ""}`}
				subheader={posted}
			/>
			<CardMedia
				className={classes.media}
				image={image_url}
				onClick={() => redirectUser()}
			/>
			<CardContent>
				<Typography variant='body2' component='p'>
					Location: {location}
				</Typography>
				<Typography variant='body2' component='p'>
					Details: {details}
				</Typography>
				<Typography
					variant='body2'
					color='textSecondary'
					component='p'
					className={classes.description}
				>
					{description.substring(0, LIMIT) + "..."}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton
					className={clsx(classes.expand, {
						[classes.expandOpen]: expanded,
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label='show more'
				>
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout='auto' unmountOnExit>
				<CardContent>
					<Typography
						variant='body2'
						color='textSecondary'
						component='p'
					>
						{description.substring(LIMIT + 1)}
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default AdCard;

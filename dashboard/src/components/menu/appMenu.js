import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
	menuButton: {
		marginRight: theme.spacing(2),
	},
	toolbarButtons: {
		marginLeft: "auto",

		"& > *": {
			color: theme.palette.background.paper,
		},
	},
	typography: {
		color: theme.palette.background.paper,
	},
}));

const AppMenu = (props) => {
	const classes = useStyles();

	return (
		<AppBar position='sticky'>
			<Toolbar>
				<IconButton
					edge='start'
					className={classes.menuButton}
					color='inherit'
					aria-label='menu'
				>
					<MenuIcon />
				</IconButton>
				<Button component={Link} to='/' className={classes.title}>
					<Typography className={classes.typography}>
						KijijiWatcher
					</Typography>
				</Button>
				<div className={classes.toolbarButtons}>
					<Button component={Link} to='/'>
						<Typography>My Watchlist</Typography>
					</Button>
					<Button component={Link} to='/ads'>
						<Typography>My Ads</Typography>
					</Button>
					<Button component={Link} to='/'>
						<Typography>My URLs</Typography>
					</Button>
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default AppMenu;

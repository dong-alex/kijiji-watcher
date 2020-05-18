import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import axios from "axios";
import Box from "@material-ui/core/Box";
import { API_URI } from "./config";
import AddForm from "./components/forms/addForm";
import AppMenu from "./components/menu/appMenu";
import WatchList from "./components/watchlist/watchlist";
import ListingBase from "./components/listings/listingBase";

const App = () => {
	const [watchlist, setWatchlist] = useState([]);
	const [listings, setListings] = useState([]);
	let source;

	useEffect(() => {
		const fetch = async () => {
			axios
				.get(`${API_URI}/urls/`)
				.then(({ data }) => {
					console.log(data);
					setWatchlist(data);
				})
				.catch((err) => {
					throw err;
				});
			axios
				.get(`${API_URI}/listings/`)
				.then(({ data }) => {
					console.log(data);
					setListings(data);
				})
				.catch((err) => {
					throw err;
				});
		};

		fetch();
	}, []);

	const handleDeleteURL = async (selectedID) => {
		console.log("Deleting the URL with the ID", selectedID);
		// post request to delete and delete from the front end if it is successful - prompt error otherwise
		await axios
			.put(`${API_URI}/lists/`, {
				id: selectedID,
				clear: false,
			})
			.then((res) => {
				console.log(res);
				const newList = watchlist.filter(({ id }) => id !== selectedID);
				setWatchlist([...newList]);
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	};

	const handleSubmitURL = async (event, watchlistURL, tag) => {
		return axios
			.post(`${API_URI}/urls/`, {
				url: watchlistURL,
				tag,
				used: false,
				dealer: false,
			})
			.then(({ data }) => {
				console.log(data);
				setWatchlist([...watchlist, data]);
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	};

	const handleListingRefresh = async (event) => {
		// prevent multiple requests overlapping
		if (source) {
			source.cancel("Cancelling previous request");
		}

		const CancelToken = axios.CancelToken;
		source = CancelToken.source();

		return axios
			.get(`${API_URI}/crawl/`, { cancelToken: source.token })
			.then(({ data }) => {
				setListings(data);
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log(err.message);
					return err.message;
				} else {
					console.log(err.message);
					return err.message;
				}
			});
	};

	const handleRefreshCancel = () => {
		source.cancel("Operation cancelled.");
	};

	return (
		<Box>
			<AppMenu />
			<Switch>
				<Route path='/watchlist'>
					<WatchList
						watchlist={watchlist}
						onDeleteURL={handleDeleteURL}
					/>
				</Route>
				<Route path='/ads'>
					<ListingBase
						listings={listings}
						watchlist={watchlist}
						onRefreshCancel={handleRefreshCancel}
						onListingRefresh={handleListingRefresh}
					/>
				</Route>
				<Route path='/'>
					<WatchList
						watchlist={watchlist}
						onDeleteURL={handleDeleteURL}
					/>
					<AddForm onSubmitURL={handleSubmitURL} urls={watchlist} />
				</Route>
			</Switch>
		</Box>
	);
};

export default App;

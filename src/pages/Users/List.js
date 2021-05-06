import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
	Box,
	Button,
	IconButton,
	makeStyles,
	Paper,
	TextField,
	InputAdornment,
	SvgIcon,
} from '@material-ui/core';

import InfoRounded from '@material-ui/icons/InfoRounded';
import EditIcon from '@material-ui/icons/Edit';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SearchIcon from '@material-ui/icons/Search';

import { db } from '../../firebase';

const useStyles = makeStyles((theme) => ({
	// root: {
	// 	'& .super-app-theme--header': {
	// 		backgroundColor: '#c1c1c1',
	// 	},
	// },

	rootPaper: {
		padding: theme.spacing(6),
		backgroundColor: 'transparent',
		borderColor: '#fafafa',
	},
	dataGrid: {
		border: 'none',
	},
	boxCenter: {
		[theme.breakpoints.down('xs')]: {
			justifyContent: 'center',
		},
		padding: theme.spacing(6),
	},
	textFieldSearch: {
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: '#fafafa',
			},
		},
	},
}));

export const streamUsersRole = (observer) => {
	return db.collection('usersRole').onSnapshot(observer);
};

const List = ({ history }) => {
	const classes = useStyles();
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	const [search, setSearch] = useState('');
	const [dataSearched, setdataSearched] = useState([]);

	useEffect(() => {
		const unsubscribe = streamUsersRole({
			next: (querySnapshot) => {
				const updateUsersRole = querySnapshot.docs.map((docSnapshot) => {
					return { ...docSnapshot.data(), id: docSnapshot.id };
				});

				setUsers(updateUsersRole);
			},
			error: () => console.log('grocery-list-item-get-fail'),
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		users.filter((val) => {
			if (search === '') {
				setdataSearched([]);
			} else if (val.lastName.toLowerCase().includes(search.toLowerCase())) {
				setdataSearched([val]);
			} else if (val.email.toLowerCase().includes(search.toLowerCase())) {
				setdataSearched([val]);
			} else if (val.name.toLowerCase().includes(search.toLowerCase())) {
				setdataSearched([val]);
			}
		});
	}, [search]);

	const handleEditUser = async ({ row }) => {
		history.push('/users/edit', row);
	};

	const columns = [
		{
			field: 'name',
			headerName: 'Nombre',
			flex: isDesktop ? 1 : 0,
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			align: 'center',
		},
		{
			field: 'lastName',
			headerName: 'Apellidos',
			flex: isDesktop ? 1 : 0,
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'email',
			headerName: 'Email',
			flex: isDesktop ? 1 : 0,
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			align: 'center',
		},
		{
			field: 'role',
			headerName: 'Rango',
			flex: isDesktop ? 1 : 0,
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			align: 'center',
		},

		{
			field: 'authorization',
			headerName: 'Autorizacion',
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			flex: isDesktop ? 1 : 0,
			align: 'center',
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			headerAlign: 'center',
			headerClassName: 'super-app-theme--header',
			flex: isDesktop ? 1 : 0,
			align: 'right',
			align: 'center',

			renderCell: (params) => (
				<strong>
					<IconButton
						aria-label='delete'
						onClick={() => history.push('/users/detail', params.row)}
						style={{ color: '#fafafa' }}
					>
						<InfoRounded />
					</IconButton>

					<IconButton
						aria-label='edit'
						style={{ color: '#fafafa' }}
						onClick={() => handleEditUser(params)}
					>
						<EditIcon />
					</IconButton>
				</strong>
			),
		},
	];

	return (
		<>
			<Box
				display='flex'
				justifyContent='flex-end'
				className={classes.boxCenter}
			>
				<Button
					style={{ color: '#fafafa' }}
					color='primary'
					variant='contained'
					onClick={() => history.push('/users/add')}
				>
					Agregar
				</Button>
			</Box>
			<Paper variant='outlined' classes={{ root: classes.rootPaper }}>
				<Box mb={6}>
					<TextField
						fullWidth
						classes={{
							root: classes.textFieldSearch,
						}}
						onChange={(event) => {
							setSearch(event.target.value);
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment
									position='start'
									// className={classes.textFieldSearch}
								>
									<SvgIcon fontSize='small' color='primary'>
										<SearchIcon />
									</SvgIcon>
								</InputAdornment>
							),
						}}
						placeholder='Search customer'
						variant='outlined'
					/>
				</Box>

				<div style={{ height: 'auto', width: '100%' }}>
					<DataGrid
						rows={dataSearched.length > 0 ? dataSearched : users}
						columns={columns}
						pageSize={10}
						checkboxSelection={false}
						autoHeight={true}
						loading={users.length === 0 || loading}
						className={classes.dataGrid}
					/>
				</div>
			</Paper>
		</>
	);
};

export default List;
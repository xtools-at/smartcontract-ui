import { ReactElement, Fragment, forwardRef, useState, useCallback, useEffect, MouseEvent } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import { Function } from 'types/Function'
import { Chain } from 'types/Chain'
import PageviewIcon from '@mui/icons-material/Pageview'
import CreateIcon from '@mui/icons-material/Create'
import LoadingButton from '@mui/lab/LoadingButton'
import LockIcon from '@mui/icons-material/Lock'
import NumberFormat from 'react-number-format'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import { HistoryEntry } from 'types/History'
import Button from '@mui/material/Button'
import BlockIcon from '@mui/icons-material/Block'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DialogActions from '@mui/material/DialogActions'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { signers } from 'config/signers'
import { Signer } from 'types/Signer'


interface NumberFormatComponentProps {
	onChange: (event: { target: { name: string; value: string } }) => void;
	name: string;
}

const NumberFormatComponent = forwardRef<NumberFormat, NumberFormatComponentProps>(
	function NumberFormatCustom(props, ref) {
		const { onChange, ...other } = props

		return (
			<NumberFormat
				{...other}
				getInputRef={ref}
				onValueChange={(values) => {
					onChange({
						target: {
							name: props.name,
							value: values.value,
						},
					})
				}}
				thousandSeparator
				isNumericString
			/>
		)
	},
)

const NumberTextField = ({
	label,
	value,
	decimalDisabled = false,
	onChange,
	...props
}: {
	label: string,
	value: any,
	decimalDisabled?: boolean,
	onChange: (event: any) => void
}) => {
	const [number, setNumber] = useState('')
	const [decimal, setDecimal] = useState('')


	const triggerOnChange = useCallback((_number, _decimal) => {
		const value = `${_number}e${_decimal || 0}`
		onChange(value)
	}, [])

	useEffect(() => {
		const valueString = String(value || '')
		const valueComponents = valueString.split('e')

		setNumber(valueComponents[0])
		setDecimal(valueComponents[1] || '0')
	}, [value])



	return (
		<TextField
			// type='number'
			margin='normal'
			fullWidth
			label={label}
			// value={value}
			value={number}
			onChange={event => {
				setNumber(event.target.value)
				triggerOnChange(event.target.value, decimal)
			}}
			InputProps={{
				inputComponent: NumberFormatComponent as any,

				endAdornment: (
					<>
						<TextField
							sx={{
								height: '10px',
								marginTop: '-24px',
								width: '160px'
							}}
							disabled={decimalDisabled}
							type='number'
							margin='normal'
							size='small'
							value={decimal}
							onChange={event => {
								setDecimal(event.target.value)

								triggerOnChange(number, event.target.value)
							}}
							InputProps={{
								startAdornment: <InputAdornment position='start'>x 10 ^ </InputAdornment>,
							}}
						/>
					</>
				),
			}}
			{...props}
		/>
	)
}

export const FunctionComposer = ({
	selectedChain,
	functions,
	func,
	onFuncChange,

	args,
	setArgs,
	eth,
	setEth,
	read,
	toggleReading,
	write,
	toggleWriting,
	isReading,
	isWriting,
	canWrite,
	history,
	openHistoryEntry,


	signer,
	onSignerChange
}: {
	selectedChain: Chain,
	functions: Function[],
	func: Function | null | undefined,
	onFuncChange: (func: Function | null | undefined) => void,

	args: { [name: string]: any },
	setArgs: (args: { [name: string]: any }) => void,
	eth: string,
	setEth: (eth: string) => void,
	read: () => void,
	toggleReading: (flag: boolean) => void,
	write: () => void,
	toggleWriting: (flag: boolean) => void,
	isReading: boolean,
	isWriting: boolean,
	canWrite: boolean,
	history: HistoryEntry[],
	openHistoryEntry: (entry: HistoryEntry) => void,


	signer: Signer,
	onSignerChange: (signer: Signer) => void
}) => {
	const [historyAnchorEl, setHistoryAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(historyAnchorEl)
	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setHistoryAnchorEl(event.currentTarget)
	};
	const handleClose = () => {
		setHistoryAnchorEl(null)
	}

	const [functionSearchText, searchFunction] = useState<string>('')

	const [connectDialogIsOpen, toggleConnectDialog] = useState<boolean>(false)
	const closeConnectDialog = () => {
		toggleConnectDialog(false)
	}

	return (<>
		<Menu
			anchorEl={historyAnchorEl}
			open={open}
			onClose={handleClose}
			onClick={handleClose}
			PaperProps={{
				style: {
					maxHeight: 200
				},
				elevation: 0,
				sx: {
					overflow: 'visible',
					filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
					mt: 1.5,
					'& .MuiAvatar-root': {
						width: 32,
						height: 32,
						ml: -0.5,
						mr: 1,
					},
					'&:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: 0,
						right: 14,
						width: 10,
						height: 10,
						bgcolor: 'background.paper',
						transform: 'translateY(-50%) rotate(45deg)',
						zIndex: 0,
					},
				},
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			{history && history.map((entry, index) => (
				<MenuItem key={index} onClick={() => {
					openHistoryEntry(entry)
				}}>
					{entry.function}
				</MenuItem>
			))}
		</Menu>

		<br />
		<br />
		<Autocomplete
			disablePortal
			id='function'
			fullWidth
			options={functions}
			getOptionLabel={(option) => option.name}
			renderInput={(params) => <TextField {...params} required label='Function' helperText={
				history.length > 0 && <>
					Or browse from <Link sx={{ cursor: 'pointer' }} onClick={handleClick}>your history</Link>
				</>
			} />}
			value={func}
			onChange={(_, newValue: Function | null) => {
				onFuncChange(newValue)
			}}
			inputValue={functionSearchText}
			onInputChange={(_, newInputValue) => {
				searchFunction(newInputValue)
			}}

		/>

		{func && func.inputs.map((input) => (
			<Fragment key={`${input.name}`}>
				{(() => {
					const props = {
						fullWidth: true,
						id: input.name,
						label: `${input.name} (${input.type})`,
						name: input.name,
						autoComplete: input.name,
						value: args[input.name] || '',
						onChange: (event: any) => {
							setArgs((draft: any) => {
								draft[input.name] = event.target.value
							})
						}
					}
					if (input.type.endsWith('[]')) {
						return (
							<TextField
								multiline
								margin='normal'
								{...props}
							/>
						)
					} else if (
						input.type.startsWith('int') ||
						input.type.startsWith('uint') ||
						input.type.startsWith('fixed') ||
						input.type.startsWith('unfixed')
					) {
						// const value = args[input.name] || ''

						return (
							<NumberTextField
								{...props}
								onChange={(value) => {
									setArgs((draft: any) => {
										draft[input.name] = value
									})
								}}
							/>
						)
					} else {
						return (
							<TextField
								margin='normal'
								{...props}
							/>
						)
					}
				})()}

				<br />
			</Fragment>
		))}

		{func && <>
			{func.stateMutability === 'payable' && <>
				<NumberTextField
					label={`${selectedChain.nativeCurrency.symbol} Amount`}
					value={eth + 'e' + selectedChain.nativeCurrency.decimals}
					onChange={(value) => {
						setEth(value)
					}}
					decimalDisabled={true}
				/>

				<br />
			</>}

			<br />
			<Box sx={{ display: 'flex' }}>
				{(() => {
					const output: ReactElement[] = []

					if (
						func.stateMutability === 'pure'
						|| func.stateMutability === 'view') {
						output.push(
							<LoadingButton
								loading={isReading}
								key='read'
								type='button'
								color='success'
								variant='contained'
								startIcon={<PageviewIcon />}
								sx={{ flexGrow: 1 }}
								onClick={read}
							>
								Read
							</LoadingButton>
						)
					}

					if (
						func.stateMutability === 'payable'
						|| func.stateMutability === 'nonpayable') {
						if (output.length > 0) {
							output.push(<span key='space'> &nbsp; &nbsp; </span>)
						}

						if (canWrite) {
							output.push(
								<LoadingButton
									loading={isWriting}
									key='write'
									type='button'
									color='info'
									variant='contained'
									startIcon={<CreateIcon />}
									sx={{ flexGrow: 1 }}
									onClick={write}
								>
									Write
								</LoadingButton>
							)
						} else {
							output.push(
								<Fragment key='login'>
									<LoadingButton
										loading={false}
										type='button'
										variant='contained'
										color='warning'
										startIcon={<LockIcon />}
										sx={{ flexGrow: 1 }}
										onClick={() => {
											toggleConnectDialog(true)
										}}
									>
										Connect to Wallet
									</LoadingButton>

									<Dialog onClose={closeConnectDialog} open={connectDialogIsOpen}>
										<DialogTitle>Connect to your wallet</DialogTitle>
										<List sx={{ pt: 0 }}>
											{signers.map((s) => {
												if (s.id === 'anonymous') return null

												const Icon = s.icon
												return (
													<ListItem key={s.id} selected={signer.id === s.id} button onClick={() => {
														onSignerChange(s)
														closeConnectDialog()
													}}>
														<ListItemAvatar>
															<Avatar>
																<Icon />
															</Avatar>
														</ListItemAvatar>
														<ListItemText primary={s.name} secondary={s.description}/>
													</ListItem>
												)
											})}
										</List>
										<DialogActions>
											<Button onClick={closeConnectDialog}>Cancel</Button>
										</DialogActions>
									</Dialog>
								</Fragment>
							)
						}
					}

					return output
				})()}


			</Box>

			{isReading && <>
				<Box sx={{
					marginTop: '15px',
					width: '100%',
					textAlign: 'center'
				}}>
					<Button
						color='error'
						variant='outlined'
						fullWidth
						startIcon={<BlockIcon />}
						onClick={() => {
							toggleReading(false)
						}}>Stop</Button>
				</Box>
			</>}

			{isWriting && <>
				<Box sx={{
					marginTop: '15px',
					width: '100%',
					textAlign: 'center'
				}}>
					<Button
						color='error'
						variant='outlined'
						fullWidth
						startIcon={<BlockIcon />}
						onClick={() => {
							toggleWriting(false)
						}}>Stop</Button>
				</Box>
			</>}
		</>}
	</>)
}
import { InputMode, NetworkConfig } from '@/types/types'
import LedgerLivePlarformSDK, { Account } from '@ledgerhq/live-app-sdk'
import { Text } from '@ledgerhq/react-ui'
import GlitchText from '@ledgerhq/react-ui/components/animations/GlitchText'
import { signClient } from './SignClient'
import { CSSTransition } from 'react-transition-group'
// import { getSdkError } from '@walletconnect/utils'
import Image from 'next/image'
import { SessionTypes } from '@walletconnect/types'

import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import useInitialization from 'src/hooks/useInitialization'
import useWalletConnectEventsManager from 'src/hooks/useWalletConnectEventsManager'

import {
	pulseAnimationLight,
	pulsing,
	WalletConnectContainer,
	WalletConnectInnerContainer,
	BannerContainer,
	StatusIcon,
} from '@/styles/walletconnect'
import { TimedOutAlert } from '@/components/alerts/ErrorTimedOut'
import { InfoConnectionAlert } from '@/components/alerts/InfoConnection'
import { Connected } from '../v1/Connected'
import { PendingConnection } from '../v1/PendingConnection'
import { PendingRequest } from '../v1/PendingRequest'
import { SignClientTypes } from '@walletconnect/types'
import { EIP155_SIGNING_METHODS } from 'src/utils/EIP155Data'
import { useTranslation } from 'next-i18next'

export type WalletConnectV2Props = {
	initialMode?: InputMode
	initialAccountId?: string
	initialURI?: string
	networks: NetworkConfig[]
	platformSDK: LedgerLivePlarformSDK
	accounts: Account[]
	setUri: Dispatch<SetStateAction<string | undefined>>
}

export function WalletConnectV2({
	initialMode,
	initialAccountId,
	initialURI,
	networks = [],
	platformSDK,
	accounts,
	setUri,
}: WalletConnectV2Props) {
	// ----- Init Setup ---------------------------//
	const initialized = useInitialization()
	useWalletConnectEventsManager(initialized)
	const selectedAccountRef = useRef<Account>(accounts[0])
	const [pairedProposal, setPairedProposal] = useState()
	const wcRef = useRef<WalletConnectV2Props>()
	const { t } = useTranslation()

	// const onSessionProposal = useCallback(
	// 	(proposal: SignClientTypes.EventArguments['session_proposal']) => {
	// 		console.log('SessionProposalMade', { proposal })
	// 		setPairedProposal(proposal)
	// 		console.log('pairedProposal', pairedProposal)
	// 	},
	// 	[],
	// )

	useEffect(() => {
		if (initialized && initialURI) {
			signClient.pair({ uri: initialURI })
			console.log('ji...')
		}
	}, [initialized, accounts])

	const onSessionProposal = useCallback(
		(proposal: SignClientTypes.EventArguments['session_proposal']) => {
			console.log('SessionProposalMade', { proposal })
			setPairedProposal(proposal)
			console.log('pairedProposal', proposal)
		},
		[],
	)

	const onSessionRequest = useCallback(
		async (
			requestEvent: SignClientTypes.EventArguments['session_request'],
		) => {
			console.log('session_request', requestEvent)
			const { topic, params } = requestEvent
			const { request } = params
			const requestSession = signClient.session.get(topic)

			switch (request.method) {
				case EIP155_SIGNING_METHODS.ETH_SIGN:
				case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
					return console.log('SessionSignModal', {
						requestEvent,
						requestSession,
					})

				case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
				case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
				case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
					return console.log('SessionSignTypedDataModal', {
						requestEvent,
						requestSession,
					})

				case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
				case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
					return console.log('SessionSendTransactionModal', {
						requestEvent,
						requestSession,
					})

				default:
					return console.log('SessionUnsuportedMethodModal', {
						requestEvent,
						requestSession,
					})
			}
		},
		[],
	)

	useEffect(() => {
		if (initialized) {
			signClient.on('session_proposal', onSessionProposal)
			signClient.on('session_request', onSessionRequest)
			// TODOs
			signClient.on('session_ping', (data) => console.log('ping', data))
			signClient.on('session_event', (data) => console.log('event', data))
			signClient.on('session_update', (data) =>
				console.log('update', data),
			)
			signClient.on('session_delete', (data) =>
				console.log('delete', data),
			)
		}
	}, [initialized, onSessionProposal, onSessionRequest])

	// ----- function Handers ---------------------------//
	const cleanup = useCallback((timedOut = false) => {
		// cleaning everything and reverting to initial state
		// setState((oldState) => {
		// 	return {
		// 		...oldState,
		// 		session: null,
		// 		timedOut,
		// 	}
		// })
		// wcRef.current = undefined
		setUri(undefined)
		localStorage.removeItem('session')
		localStorage.removeItem('sessionURI')
	}, [])

	// @function: Handle deletion of a session
	async function onDeleteSession() {
		await signClient.disconnect({
			topic: 'ledger',
			reason: getSdkError('USER_DISCONNECTED'),
		})
		// replace('/sessions')
		// setLoading(false)
	}

	// async function handleConnectAccept() {
	// 	try {
	// 		console.log('handleConnectAccept...')

	// 		const { uri, approval } = await signClient.connect({
	// 			// Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
	// 			// pairingTopic: pairing?.topic,
	// 			// Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
	// 			requiredNamespaces: {
	// 				eip155: {
	// 					methods: [
	// 						'eth_sendTransaction',
	// 						'eth_signTransaction',
	// 						'eth_sign',
	// 						'personal_sign',
	// 						'eth_signTypedData',
	// 					],
	// 					chains: ['eip155:1'],
	// 					events: ['chainChanged', 'accountsChanged'],
	// 				},
	// 			},
	// 		})

	// 		console.log('handAccept URI', uri)
	// 		console.log('handAccept approval', approval)

	// 		const session = await approval()
	// 		console.log('handAccept session', session)

	// 		const result = await signClient.request({
	// 			topic: session.topic,
	// 			chainId: 'eip155:1',
	// 			request: {
	// 				id: 1,
	// 				jsonrpc: '2.0',
	// 				method: 'personal_sign',
	// 				params: [
	// 					'0x1d85568eEAbad713fBB5293B45ea066e552A90De',
	// 					'0x7468697320697320612074657374206d65737361676520746f206265207369676e6564',
	// 				],
	// 			},
	// 		})

	// 		console.log('handAccept result', result)

	// 		// Handle the returned session (e.g. update UI to "connected" state).
	// 		// await onSessionConnected(session)
	// 		// console.log('session', session)
	// 	} catch (e) {
	// 		console.log('handleConnect error', e)
	// 	}
	// }

	async function handleAccept() {
		// Get required proposal data
		const { id, params } = pairedProposal
		const { requiredNamespaces, relays } = params
		console.log('id', id)
		console.log('params', params)
		console.log('requiredNamespaces', requiredNamespaces)
		console.log('relays', relays)

		if (pairedProposal) {
			const namespaces: SessionTypes.Namespaces = {}
			Object.keys(requiredNamespaces).forEach((key) => {
				const accounts = [
					`eip155:1:${selectedAccountRef.current.address}`,
				]
				// requiredNamespaces[key].chains.map((chain) => {
				// 	selectedAccounts[key].map((acc) =>
				// 		accounts.push(`${chain}:${acc}`),
				// 	)
				// })
				console.log('accounts3', accounts)
				namespaces[key] = {
					accounts,
					methods: requiredNamespaces[key].methods,
					events: requiredNamespaces[key].events,
				}
			})

			const { acknowledged } = await signClient.approve({
				id: id,
				relayProtocol: relays[0].protocol,
				namespaces,
			})
			console.log('Session Proposal id', id)
			console.log('Session Proposal relayProtocol', relays[0].protocol)
			console.log('Session Proposal namespaces', namespaces)
			await acknowledged()
		}
	}

	const handleDisconnect = useCallback(() => {
		if (wcRef.current) {
			// wcRef.current.killSession()
		}
	}, [])

	const handleTimeout = useCallback(() => {
		cleanup(true)
	}, [])

	const handleCancel = useCallback(() => {
		cleanup()
	}, [])

	// Components
	const connectedContent = () => {
		return (
			<CSSTransition classNames="fade" timeout={200}>
				<Connected
					account={selectedAccountRef.current}
					onDisconnect={onDeleteSession}
					onSwitchAccount={onDeleteSession}
				/>
			</CSSTransition>
		)
	}

	// Render pattern
	// 1. Accept / Reject with Chains + Methods once Initilized and Proposal
	// 2. You are now connected. Disconnect
	// 3. Interact with the dApp.

	// const dappDescriptionContent = <></>

	const acceptStep = () => {
		return (
			<>
				<StatusIcon pulse={initialized}>
					<Image
						width="55px"
						height="55px"
						src="/icons/walletconnect-logo.svg"
						alt="walletconnect-logo"
					/>
				</StatusIcon>
				<Text variant="h4" mt={8} textAlign="center">
					<GlitchText
						duration={2000}
						delay={0}
						text={t('session.connecting', {
							appName:
								pairedProposal?.params?.proposer?.metadata?.url,
						})}
					/>
				</Text>
				<CSSTransition classNames="fade" timeout={200}>
					<PendingRequest
						account={selectedAccountRef.current}
						onAccept={handleAccept}
						onDecline={handleDisconnect} // ToDo: HandleDisconnect
						onSwitchAccount={handleDisconnect} // ToDo: HandleDisconnect
					/>
				</CSSTransition>
			</>
		)
	}

	return (
		<WalletConnectContainer>
			<BannerContainer>
				{initialized ? (
					<CSSTransition classNames="fade" timeout={200}>
						<InfoConnectionAlert peerMeta={'test'} />
					</CSSTransition>
				) : null}
				{/* {timedOut ? (
					<CSSTransition classNames="fade" timeout={200}>
						<TimedOutAlert />
					</CSSTransition>
				) : null} */}
			</BannerContainer>
			<WalletConnectInnerContainer>
				{initialized ? (
					// connectedContent()
					acceptStep()
				) : (
					<PendingConnection
						timeout={10000}
						onTimeout={handleTimeout}
						onCancel={handleCancel}
					/>
				)}
				{/* {pendingContent} */}
			</WalletConnectInnerContainer>
		</WalletConnectContainer>
	)
}

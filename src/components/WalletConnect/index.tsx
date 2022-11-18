import { InputMode, NetworkConfig } from '@/types/types'
import LedgerLivePlarformSDK, { Account } from '@ledgerhq/live-app-sdk'
import { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { WalletConnectV1 } from './v1'
import { Disconnected } from './v1/Disconnected'
import { WalletConnectV2 } from './v2'

export type WalletConnectProps = {
	initialMode?: InputMode
	initialAccountId?: string
	initialURI?: string
	networks: NetworkConfig[]
	platformSDK: LedgerLivePlarformSDK
	accounts: Account[]
}

export default function WalletConnect({
	initialURI,
	initialMode,
	...rest
}: WalletConnectProps) {
	const [uri, setUri] = useState<string | undefined>(initialURI)

	if (!uri) {
		return (
			<CSSTransition classNames="fade" timeout={200}>
				<Disconnected mode={initialMode} onConnect={setUri} />
			</CSSTransition>
		)
	}

	if (uri?.includes('@1?')) {
		console.log('walletConnect v1', uri)
		return (
			<WalletConnectV1
				initialURI={uri || initialURI}
				setUri={setUri}
				{...rest}
			/>
		)
	} else {
		console.log('walletConnect v2', uri)
		return <WalletConnectV2 initialURI={uri || initialURI} {...rest} />
	}
}

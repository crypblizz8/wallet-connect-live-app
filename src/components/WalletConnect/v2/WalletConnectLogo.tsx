import { StatusIcon } from '@/styles/walletconnect'
import Image from 'next/image'

export function WalletConnectLogo(initialized: boolean) {
	return (
		<StatusIcon pulse={initialized}>
			<Image
				width="55px"
				height="55px"
				src="/icons/walletconnect-logo.svg"
				alt="walletconnect-logo"
			/>
		</StatusIcon>
	)
}

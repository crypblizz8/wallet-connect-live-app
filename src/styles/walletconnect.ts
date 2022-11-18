import styled, { css, keyframes } from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export const pulseAnimationLight = keyframes`
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
	}
`

export const pulseAnimationDark = keyframes`
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
`

export const pulsing = css`
	animation: ${({ theme }) =>
			theme.theme === 'light' ? pulseAnimationDark : pulseAnimationLight}
		2s infinite;
`

export const StatusIcon = styled.div<{ pulse: boolean }>`
	pointer-events: none;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;

	background: ${({ theme }) => theme.colors.neutral.c100};
	border-radius: 50%;
	height: 80px;
	width: 80px;

	box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
	transform: scale(1);
	${({ pulse }) => (pulse ? pulsing : null)}
`

export const WalletConnectContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	user-select: none;
`

export const WalletConnectInnerContainer = styled(TransitionGroup)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`

export const BannerContainer = styled(TransitionGroup)`
	z-index: 2;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	padding: 12px;

	> div {
		margin-top: 12px;
	}

	div:first-child {
		margin-top: 0px;
	}
`
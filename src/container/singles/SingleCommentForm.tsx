import React, { FC, useContext, useEffect } from 'react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Textarea from '@/components/Textarea/Textarea'
import Button from '@/components/Button/Button'
import { CommentWrapContext } from './SingleCommentWrap'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import getTrans from '@/utils/getTrans'
import Label from '@/components/Label/Label'
import Input from '@/components/Input/Input'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import toast from 'react-hot-toast'

export interface CommentSubmitData {
	content: string
	username?: string
	email?: string
}

export interface SingleCommentFormProps {
	className?: string
	onClickSubmit?: (data: CommentSubmitData) => void
	onClickCancel?: () => void
	defaultValue?: string
	rows?: number
	isAutoFocus?: boolean
	isReplyingComment?: boolean
	isEditingComment?: boolean
	isSuccessfulCreatedComment?: boolean
}

const SingleCommentForm: FC<SingleCommentFormProps> = ({
	className = 'mt-5',
	onClickSubmit,
	onClickCancel,
	defaultValue = '',
	rows = 4,
	isAutoFocus,
	isReplyingComment,
	isEditingComment,
	isSuccessfulCreatedComment,
}) => {
	const textareaRef = React.useRef<HTMLTextAreaElement>(null)
	const T = getTrans()
	//
	const { openLoginModal } = useLoginModal()
	const { isReady, isAuthenticated } = useSelector(
		(state: RootState) => state.viewer.authorizedUser,
	)
	let {
		isCreateNewCommentLoading,
		isCreateNewReplyCommentLoading,
		isUpdateCommentByIdLoading,
	} = useContext(CommentWrapContext)
	//
	useEffect(() => {
		isAutoFocus && textareaRef.current?.focus()
	}, [textareaRef, isAutoFocus])

	// remove text on textarea when submit success
	useEffect(() => {
		if (
			isReplyingComment ||
			isEditingComment ||
			isCreateNewCommentLoading ||
			isSuccessfulCreatedComment
		) {
			return
		}

		textareaRef.current && (textareaRef.current.value = '')
	}, [
		isCreateNewCommentLoading,
		textareaRef,
		isEditingComment,
		isReplyingComment,
		isSuccessfulCreatedComment,
	])

	const { discussion_settings } = NC_SITE_SETTINGS
	const mustLoggedToComment = discussion_settings?.must_logged_in_to_comment
	const showNameAndEmailInput =
		!mustLoggedToComment && isAuthenticated === false

	let isLoading = false
	if (isReplyingComment) {
		isLoading = !!isCreateNewReplyCommentLoading
	} else if (isEditingComment) {
		isLoading = !!isUpdateCommentByIdLoading
	} else {
		isLoading = !!isCreateNewCommentLoading
	}

	return (
		<form
			action="#"
			onSubmit={(e) => {
				e.preventDefault()
				if (isLoading || !isReady) {
					toast.error(T['Please wait a moment before trying again'] + '!')
					return
				}
				if (!isAuthenticated && mustLoggedToComment) {
					openLoginModal()
					return
				}

				const email = e.currentTarget.email?.value
				const username = e.currentTarget.username?.value

				// check if user is not logged in and must_logged_in_to_comment is false
				if (!isAuthenticated && !mustLoggedToComment) {
					// check if user fill in the name and email
					if (!email || !username) {
						toast.error(T['Username and email are required'] + '!')
						return
					}
				}

				onClickSubmit &&
					onClickSubmit({
						content: textareaRef.current?.value || '',
						username,
						email,
					})
			}}
			className={`nc-SingleCommentForm ${className}`}
		>
			<Textarea
				placeholder={T.pageSingle['Add to discussion']}
				ref={textareaRef}
				required
				defaultValue={defaultValue}
				rows={rows}
				// cannot use onFocus because it will show the login modal more times
				onClick={() => {
					if (isAuthenticated === false && mustLoggedToComment) {
						openLoginModal()
					}
				}}
			/>
			{showNameAndEmailInput ? (
				<div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
					<div className="grid gap-1.5">
						<Label htmlFor="username">{T.Username}*</Label>
						<Input
							placeholder="Your name"
							id="username"
							type="text"
							autoComplete="username"
							required
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="email">{T.Email}*</Label>
						<Input
							id="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							type="email"
							placeholder="hello@123.mail"
							required
						/>
					</div>
				</div>
			) : null}

			<div className="mt-2.5 flex flex-wrap gap-2">
				<ButtonPrimary loading={isLoading} type="submit">
					{T.Submit}
				</ButtonPrimary>
				<Button
					type="button"
					disabled={isLoading}
					pattern="link"
					onClick={() => {
						onClickCancel && onClickCancel()
						if (textareaRef.current) {
							textareaRef.current.value = ''
						}
					}}
				>
					{T.Cancel}
				</Button>
			</div>
		</form>
	)
}

export default SingleCommentForm

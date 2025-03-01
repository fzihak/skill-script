'use client'

import { FC, useContext } from 'react'
import Avatar from '@/components/Avatar/Avatar'
import twFocusClass from '@/utils/twFocusClass'
import Link from 'next/link'
import {
	CommentStatusEnum,
	NcmazFcCommentFullFieldsFragment,
} from '@/__generated__/graphql'
import { getImageDataFromImageFragment } from '@/utils/getImageDataFromImageFragment'
import ncFormatDate from '@/utils/formatDate'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import { CommentWrapContext } from '@/container/singles/SingleCommentWrap'
import Loading from '../Button/Loading'
import toast from 'react-hot-toast'
import { useLoginModal } from '@/hooks/useLoginModal'
import getTrans from '@/utils/getTrans'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import { Delete03Icon, Edit02Icon, MyArrowMoveUpLeftIcon } from '../Icons/Icons'

const T = getTrans()

export type TComment = NcmazFcCommentFullFieldsFragment

export type TCommentHasChild = TComment & {
	children?: TComment[]
}

export interface CommentCardProps {
	className?: string
	comment: TComment
	size?: 'large' | 'normal'
	onClickReply?: (comment: TComment) => void
	onClickEdit?: (comment: TComment) => void
	onClickDelete?: (comment: TComment) => void
}

const CommentCard: FC<CommentCardProps> = ({
	className = '',
	comment,
	size = 'large',
	onClickDelete,
	onClickEdit,
	onClickReply,
}) => {
	const { id, date, content, author, databaseId } = comment || {}
	const { isReady, isAuthenticated } = useSelector(
		(state: RootState) => state.viewer.authorizedUser,
	)
	const { openLoginModal } = useLoginModal()
	const { viewer } = useSelector((state: RootState) => state.viewer)

	const isShowDeleteAndEditButton =
		viewer?.capabilities?.includes('edit_others_posts') ||
		(viewer?.databaseId === author?.node.databaseId &&
			viewer?.capabilities?.includes('edit_posts'))
	//
	const { discussion_settings } = NC_SITE_SETTINGS
	const mustLoggedToComment = discussion_settings?.must_logged_in_to_comment

	let {
		isDeleteCommentsByIdLoading,
		isDeletingDatabaseId,
		isUpdateCommentByIdLoading,
		isEditingDatabaseId,
	} = useContext(CommentWrapContext)
	//

	const getAuthorAvatar = () => {
		if (author?.node.__typename === 'CommentAuthor') {
			return author?.node?.avatar?.url || ''
		}
		if (author?.node.__typename === 'User') {
			return (
				getImageDataFromImageFragment(
					author?.node?.ncUserMeta?.featuredImage?.node,
				).sourceUrl || ''
			)
		}
	}

	const handleClickReplyBtn = () => {
		if (!isReady) {
			toast.error('Please wait a moment, data is being prepared.')
			return
		}

		// open login modal when click reply if not login
		if (!isAuthenticated && mustLoggedToComment) {
			openLoginModal()
			return
		}

		if (isAuthenticated && !viewer?.databaseId) {
			toast.error('Please wait a moment, data is being prepared.')
			return
		}

		// open reply form
		onClickReply?.(comment)
	}

	return (
		<>
			<div
				className={`nc-CommentCard flex gap-[6px] sm:gap-[12px] ${className}`}
				id={'comment-' + databaseId}
			>
				<Avatar
					sizeClass={`${
						size === 'large'
							? 'text-sm sm:text-base w-[28px] h-[28px] sm:h-[32px] sm:w-[32px]'
							: 'w-[24px] h-[24px] sm:h-[28px] sm:w-[28px] text-sm'
					}`}
					radius="rounded-full"
					containerClassName="mt-[8px] sm:mt-[14px] flex-shrink-0"
					imgUrl={getAuthorAvatar()}
					userName={author?.node.name || 'N'}
				/>
				<div className="nc-CommentCard__box flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 p-2 text-sm sm:p-4 sm:text-base dark:border-neutral-700">
					{/* AUTHOR INFOR */}
					<div className="space-y-1">
						<div className="relative flex items-center">
							{author?.node.__typename === 'User' && (
								<Link
									className="flex-shrink-0 font-semibold text-neutral-800 dark:text-neutral-100"
									href={author?.node.uri || '/'}
								>
									{author.node.name}
								</Link>
							)}

							{author?.node.__typename === 'CommentAuthor' && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									className="flex-shrink-0 text-xs font-semibold text-neutral-800 sm:text-sm dark:text-neutral-100"
									href={author?.node.url || '/'}
								>
									{author.node.name}
								</a>
							)}
							<span className="mx-2">·</span>
							<span className="line-clamp-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
								{ncFormatDate(date || '')}
							</span>
						</div>
						{comment.status !== CommentStatusEnum.Approve ? (
							<span className="text-xs italic text-neutral-700 dark:text-neutral-300">
								(This comment is pending approval.)
							</span>
						) : null}
					</div>

					{/* CONTENT */}
					<div
						dangerouslySetInnerHTML={{ __html: content || '' }}
						className="prose-sm mb-3 mt-2 block max-w-none dark:prose-invert sm:mb-4 sm:mt-3"
					></div>

					{/* ACTION  REPLY / DELETE/ EDIT */}
					<div className="flex flex-wrap gap-2">
						{comment.status === CommentStatusEnum.Approve ? (
							<button
								className={`inline-flex h-8 min-w-[68px] items-center self-start rounded-full bg-neutral-100 px-3 text-neutral-600 hover:bg-teal-50 hover:text-teal-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-teal-200/10 dark:hover:text-teal-400 ${twFocusClass()} `}
								title="Reply"
								onClick={handleClickReplyBtn}
							>
								<MyArrowMoveUpLeftIcon className="me-2 h-[18px] w-[18px]" />

								<span className="text-xs leading-none">{T['Reply']}</span>
							</button>
						) : null}

						{/* Edit */}
						{isShowDeleteAndEditButton ? (
							<button
								className={`inline-flex h-8 min-w-[68px] items-center self-start rounded-full bg-neutral-100 px-3 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-indigo-100/10 dark:hover:text-indigo-400 ${twFocusClass()} `}
								title="Edit comment"
								onClick={() => onClickEdit?.(comment)}
							>
								{isEditingDatabaseId === comment.databaseId &&
								isUpdateCommentByIdLoading ? (
									<Loading />
								) : (
									<Edit02Icon className="me-2 h-4 w-4" />
								)}
								<span className="text-xs leading-none">{T['Edit']}</span>
							</button>
						) : null}

						{/* Delete */}
						{isShowDeleteAndEditButton ? (
							<button
								className={`inline-flex h-8 min-w-[68px] items-center self-start rounded-full bg-neutral-100 px-3 text-neutral-600 hover:bg-rose-100/80 hover:text-rose-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-rose-100/10 dark:hover:text-rose-300 ${twFocusClass()} `}
								title="Delete comment"
								onClick={() => onClickDelete?.(comment)}
							>
								{isDeletingDatabaseId === comment.databaseId &&
								isDeleteCommentsByIdLoading ? (
									<Loading />
								) : (
									<Delete03Icon className="me-2 h-4 w-4" />
								)}
								<span className="text-xs leading-none">{T['Delete']}</span>
							</button>
						) : null}
					</div>
				</div>
			</div>
		</>
	)
}

export default CommentCard

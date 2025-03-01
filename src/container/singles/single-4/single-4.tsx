import React, { FC } from 'react'
import SingleHeader4 from '../SingleHeader4'
import { SingleType1Props } from '../single/single'

interface Props extends SingleType1Props {}

const SingleType4: FC<Props> = ({ post }) => {
	return (
		<>
			<div className="absolute inset-x-0 top-0 h-[480px] bg-neutral-900 md:h-[600px] lg:h-[700px] xl:h-[95vh] dark:bg-black/30"></div>

			<header className="container relative z-10 rounded-xl pt-10 lg:pt-16">
				<SingleHeader4 post={post} />
			</header>
		</>
	)
}

export default SingleType4

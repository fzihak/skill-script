import React from 'react'

//
const CoreFreeform = (props: any) => {
	const { renderedHtml } = props || {}

	let processedHtml = renderedHtml
	// kieemr tra xem renderedHtml có <Table> không,
	if (renderedHtml.includes('<table')) {
		processedHtml = wrapTablesInDiv(renderedHtml)
	}

	return (
		<div
			className="CoreFreeform overflow-hidden"
			dangerouslySetInnerHTML={{ __html: processedHtml || '' }}
		></div>
	)
}

export function wrapTablesInDiv(html: string): string {
	// Regex để tìm các thẻ <table> không nằm trong thẻ <code> và không đã được bao bọc bởi div.table-wrapper
	const tableRegex =
		/(?<!<code[^>]*>)(?<!<div class="table-wrapper">[\s\S]*?)(<table\b[^>]*>[\s\S]*?<\/table>)(?![^<]*<\/code>)/gi

	// Thay thế mỗi thẻ <table> phù hợp bằng một <div> bao quanh nó
	return html.replace(tableRegex, '<div class="table-wrapper">$1</div>')
}

CoreFreeform.displayName = 'CoreFreeform'
export default CoreFreeform

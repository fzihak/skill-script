// 'use client'

// import { usePathname } from 'next/navigation'
// import Script from 'next/script'
// import React, { useEffect, useRef, useState } from 'react'

// //
// const CoreHtml = (props: any) => {
// 	const { renderedHtml: html, clientId: id } = props || {}

// 	const containerRef = useRef<HTMLDivElement>(null)
// 	const [error, setError] = useState<string | null>(null)
// 	const pathname = usePathname()

// 	useEffect(() => {
// 		if (!containerRef.current) return

// 		const executeScripts = () => {
// 			const scripts = containerRef.current?.getElementsByTagName('script')
// 			if (!scripts) return

// 			Array.from(scripts).forEach((script, index) => {
// 				try {
// 					const newScript = document.createElement('script')
// 					Array.from(script.attributes).forEach((attr) =>
// 						newScript.setAttribute(attr.name, attr.value),
// 					)

// 					// Replace 'DOMContentLoaded' event listener with immediate execution
// 					const scriptContent = script.innerHTML

// 					// Wrap the script content in an IIFE with a unique name and error handling
// 					const wrappedContent = `
// 				(function IIFE_${id}_${index}_${Date.now()}() {
// 				  try {
// 					${scriptContent}
// 				  } catch (error) {
// 					console.error('Error in script ${id}_${index}:', error);
// 				  }
// 				})();
// 			  `
// 					newScript.appendChild(document.createTextNode(wrappedContent))
// 					script.parentNode?.replaceChild(newScript, script)
// 				} catch (error) {
// 					console.error(`Error executing script ${id}_${index}:`, error)
// 					setError(`Error executing script ${id}_${index}`)
// 				}
// 			})
// 		}

// 		// Use MutationObserver to detect when the HTML content is fully loaded
// 		const observer = new MutationObserver((mutations) => {
// 			mutations.forEach((mutation) => {
// 				if (mutation.type === 'childList') {
// 					executeScripts()
// 					observer.disconnect()
// 				}
// 			})
// 		})

// 		observer.observe(containerRef.current, { childList: true, subtree: true })

// 		// Execute scripts immediately after observing
// 		executeScripts()

// 		// Cleanup function
// 		return () => {
// 			observer.disconnect()
// 		}
// 	}, [html, id, pathname])
// 	// useEffect(() => {
// 	// 	if (containerRef.current) {
// 	// 		const scripts = containerRef.current.getElementsByTagName('script')
// 	// 		Array.from(scripts).forEach((script, index) => {
// 	// 			const newScript = document.createElement('script')
// 	// 			Array.from(script.attributes).forEach((attr) =>
// 	// 				newScript.setAttribute(attr.name, attr.value),
// 	// 			)

// 	// 			// Wrap the script content in an IIFE with a unique name
// 	// 			const wrappedContent = `
// 	// 		  (function IIFE_${clientId}_${index}() {
// 	// 			${script.innerHTML}
// 	// 		  })();
// 	// 		`
// 	// 			newScript.appendChild(document.createTextNode(wrappedContent))
// 	// 			script.parentNode?.replaceChild(newScript, script)
// 	// 		})
// 	// 	}
// 	// }, [renderedHtml, clientId])

// 	return (
// 		<>
// 			<div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
// 			{error && <div className="my-2 text-xs text-red-500">Error: {error}</div>}
// 		</>
// 	)
// }

// CoreHtml.displayName = 'CoreHtml'
// export default CoreHtml

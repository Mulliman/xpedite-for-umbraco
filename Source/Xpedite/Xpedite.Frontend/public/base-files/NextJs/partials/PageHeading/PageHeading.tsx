import { TypedUmbracoNode } from "@/umbraco/types";

import './PageHeading.css'

export type PageHeadingProps = { 
    pageTitle?: any,
}

export default function PageHeading ({ pageTitle } : PageHeadingProps) {
    return (
        <div className="partial-page-heading">
            <div className="partial-page-heading-name">Partial: PageHeading</div>
    
            <h1>{ pageTitle }</h1>
        </div>
    )
}
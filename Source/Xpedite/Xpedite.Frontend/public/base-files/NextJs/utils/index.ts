export function getNextJsCompatibleSlug(umbracoPath: string): string[] {
    return umbracoPath.split('/').filter(notEmpty)
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined && value !== '';
}
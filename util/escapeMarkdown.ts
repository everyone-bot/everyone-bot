const replacements: Array<[RegExp, string]> = [
    [/_/g, '\\_'],
    [/\*/g, '\\*'],
    [/\[/g, '\\['],
    [/\]/g, '\\]'],
    [/\(/g, '\\('],
    [/\)/g, '\\)'],
    [/~/g, '\\~'],
    [/`/g, '\\`'],
    [/>/g, '\\>'],
    [/#/g, '\\#'],
    [/\+/g, '\\+'],
    [/-/g, '\\-'],
    [/=/g, '\\='],
    [/\|/g, '\\|'],
    [/\{/g, '\\{'],
    [/\}/g, '\\}'],
    [/\./g, '\\.'],
    [/\!/g, '\\!'],
]

export const escape = (value: string): string => {
    let escapedValue = value

    replacements.forEach(replacement => {
        escapedValue = escapedValue.replace(...replacement)
    })

    return escapedValue
}
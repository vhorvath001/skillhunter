const PACKAGE_EXCLUSION_LIST: string[] = [
    'org',
    'co',
    'uk',
    'hu',
    'com'
];

const isInPackageExclusionList = (p: string): boolean => {
    return PACKAGE_EXCLUSION_LIST.includes(p);
}

export default isInPackageExclusionList
const PACKAGE_EXCLUSION_LIST = [
    'org',
    'co',
    'uk',
    'hu'
];

const isInPackageExclusionList = (p) => {
    return PACKAGE_EXCLUSION_LIST.includes(p);
}

module.exports = isInPackageExclusionList;
export type ProgLangType = {
    id?: string,
    name: string,
    desc?: string,
    sourceFiles: string,
    level: number,
    packageSeparator?: string,
    removingTLDPackages: boolean,
    patterns: string[],
    scope: string
}

export type RepositoryType = {
    id: string,
    name: string,
    desc?: string,
    url: string,
    token: string
}

export type ProjectsBranchesType = {
    id: string,
    name: string,
    branches: string[]
}

export type SkillTreeNodeType = {
    id: number,
    name: string,
    enabled: boolean,
    children: SkillTreeNodeType[]
}
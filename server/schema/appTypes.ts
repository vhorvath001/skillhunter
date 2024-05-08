export type ProgLangType = {
    id?: number,
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
    id: number,
    name: string,
    desc?: string,
    url: string,
    token: string
}

export type ProjectsBranchesType = {
    id: number,
    name: string,
    branches: string[]
}

export type SkillTreeNodeType = {
    id: number,
    name: string,
    enabled: boolean,
    children: SkillTreeNodeType[]
}

export type ExtractionType = {
    id: number,
    startDate: Date,
    branches: string[],
    path: string,
    status: string,
    repository: RepositoryType,
    progLangs: ProgLangType[]
}
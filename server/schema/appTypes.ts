export type PackageRemovalPatternType = {
    type: string,
    value: string
}

type RankingType = {
    name: string,
    rangeStart: number
}

export type ProgLangType = {
    id?: number,
    name: string,
    desc?: string,
    sourceFiles: string,
    level: number,
    packageSeparator?: string,
    removingTLDPackages: boolean,
    patterns: string[],
    packageRemovalPatterns: PackageRemovalPatternType[],
    ignoringLinesPatterns: string[],
    scope: string,
    ranking?: RankingType[]
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
    projectsBranches: SelectedProjectBranchesType[],
    path: string,
    status: string,
    progressProjects?: string,
    progressCommits?: string,
    repository: RepositoryType,
    progLangs: ProgLangType[]
}

export type SelectedProjectBranchesType = {
    projectId: string,
    projectName: string,
    branch: string
}

export type ProgressLogType = {
    timestamp: Date,
    logText: string
}

export type DeveloperType = {
    id: number,
    name: string,
    email: string
}

export type DevelopersScoresType = {
    developerId: number,
    developerName: string,
    totalScore: number
}
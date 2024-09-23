import { ReactElement, useEffect, useRef } from 'react';
import Loading from '../../../../utils/Loading';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import { ECharts, EChartsOption, init } from 'echarts';
import { DeveloperSkillMapType } from '../../../../context/AppTypes';
import Form from 'react-bootstrap/Form'
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi2'
import { buildTr, formatLinkLabel, formatNodeLabel, formatScoreValue, getSymbolSize, resizeGraph, selectNode, zoom } from '../MapFunctions';

type PropsType = {
    selectedResourceType: string
}

const DeveloperSkillGraph = ({ selectedResourceType }: PropsType): ReactElement => {
    const developerSymbol = 'path://M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z'
    const skillSymbol = 'path://M 2,3 C 1.4477381,3.0000552 1.0000552,3.4477381 1,4 v 20 c 5.52e-5,0.552262 0.4477381,0.999945 1,1 h 28 c 0.552262,-5.5e-5 0.999945,-0.447738 1,-1 V 4 C 30.999945,3.4477381 30.552262,3.0000552 30,3 Z m 14,18 c 0.552285,0 1,0.447715 1,1 0,0.552285 -0.447715,1 -1,1 -0.552285,0 -1,-0.447715 -1,-1 0,-0.552285 0.447715,-1 1,-1 z m -1,5 v 1.001953 h -3.099609 c -1.334635,0.06901 -1.23112,2.070963 0.103515,2.001953 h 7.994141 c 1.334635,0 1.334635,-2.001953 0,-2.001953 H 17 V 26 Z'

    const { isDeveloperSkillMapLoading, errorMessageDeveloperSkillMap, developerSkillMap } = useExtractionMap()

    const graphRef = useRef<HTMLDivElement>(null)

    let graph: ECharts | null = null

    const formatTooltip = (params: any): string => {
        if (!params.data.type) {
            return `<table>${buildTr('Ranking:', params.data.value)}
                           ${buildTr('Score:', formatScoreValue(params.data.score))}
                           ${buildTr('Nr of changed lines:', params.data.nrOfChangedLines)}</table>`
        } else {
            const locationAttr: string = params.data.type === 'SKILL' ? buildTr('Location:', params.data.location ?? '') : ''
            const projectAttrs: string = params.data.type !== 'PROJECT' ? '' : buildTr('Description:', params.data.projectDesc ?? '') + buildTr('Path:', params.data.projectPath ?? '') + buildTr('Created at:', params.data.projectCreatedAt ?? '') + buildTr('HTTP URL to repo at:', params.data.projectHttpUrlToRepo ?? '')            
            if (selectedResourceType === 'ALL' || selectedResourceType === params.data.type) {
                return `<table>${buildTr('Type:', params.data.type)}
                               ${buildTr('Name:', params.data.name)}
                               ${locationAttr}</table>`
            } else {
                return `<table>${buildTr('Type:', params.data.type)}
                               ${buildTr('Name:', params.data.name)}
                               ${locationAttr}
                               ${projectAttrs}
                               ${buildTr('Ranking:', params.data.ranking)}
                               ${buildTr('Score:', formatScoreValue(params.data.value))}
                               ${buildTr('Nr of changed lines:', params.data.nrOfChangedLines)}</table>`
            }
        }
    }

    const getGraphOption = (data: any, zoom: number): EChartsOption => {
        const showLabelOnLinks: boolean = data.links.length < 100 && selectedResourceType !== 'ALL'

        // https://echarts.apache.org/en/option.html
        return {
            tooltip: {
                show: true,
                formatter: (params: any) => {
                    return formatTooltip(params)
                }
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                showTitle: true,
                feature: {
                    saveAsImage: {
                        show: true
                    },
                    dataView: {
                        show: true
                    }
                }
            },
            
            legend: [{
                data: data.categories.map(function (a: any) {
                    return a.name;
                }),
                selectedMode: false
            }],
            // animationDuration: 1500,
            // animationEasingUpdate: 'quinticInOut',
            animation: true,
            animationThreshold: 700,
            animationDuration: 100,
            animationEasing: 'exponentialOut',
            series: [{
                type: 'graph',
                layout: 'force',
                legendHoverLink: true,
                zoom: zoom,
                data: data.nodes,
                links: data.links.map((l: any) => {
                    return {
                        ...l,
                        'value': l.ranking,
                        'label': {
                            'show': showLabelOnLinks,
                            formatter: (params: any) => {
                                return formatLinkLabel(params)
                            }
                        }
                    }
                }),
                categories: [...data.categories],
                force: {
                    initLayout: 'none',
                    repulsion: 15000,
                    layoutAnimation: true,
                    friction: 0.2,
                    gravity: 0.1,
                    edgeLength: 10
                },
                roam: true,
                nodeScaleRatio: 0.5,
                draggable: true,
                lineStyle: {
                    color: 'source',
                    curveness: 0.1
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: (params: any) => {
                        return formatNodeLabel(params)
                    },
                    width: 100,
                    overflow: 'truncate',
                    ellipsis: '...'
                },
                edgeLabel: {
                    show: true
                },
                emphasis: {
                    disabled: false,
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5    
                    }
                },
            }]
        }
    }

    const createNode = (id: string, type: string, name: string, value: number, ranking: string, category: number, symbolSize: number, score: number, nrOfChangedLines: number, symbol: string, itemStyle: any, location?: string): any => {
        return {
            id: id,
            type: type,
            name: name,
            value: value,
            ranking: ranking,
            category: category,
            symbolSize: symbolSize,
            symbol: symbol,
            itemStyle: itemStyle,
            location: location,
            score: score,
            nrOfChangedLines: nrOfChangedLines
        }
    }

    const transformData = (developerSkillMap: DeveloperSkillMapType[]): any => {
        let nodes: any[] = []
        let developerIds = new Set<number>()
        let skillIds = new Set<number>()
        let links: any[] = []
        let categories = new Set<string>()
        const scoreArray: number[] = developerSkillMap.map(r => r.score)
        const maxScore: number = Math.max(...scoreArray)
        const minScore: number = Math.min(...scoreArray)
        for(const rec of developerSkillMap) {
            // adding to categories if prog lang is not added yet
            if (!categories.has(rec.progLang)) {
                categories.add(rec.progLang)
            }
            // adding to nodes (and developerIds) if developer is not added yet
            if (!developerIds.has(rec.developerId)) {
                developerIds.add(rec.developerId)
                const category = [...categories].indexOf(rec.progLang)
                nodes.push(
                    createNode('DEVELOPER'+rec.developerId, 'DEVELOPER', rec.developerName + ' (' + rec.developerEmail + ')', 
                               rec.score, rec.ranking, category, getSymbolSize(selectedResourceType, 'DEVELOPER', maxScore, minScore, rec.score), 
                               rec.score, rec.nrOfChangedLines, developerSymbol, { color: 'red' } )
                )
            }
            // adding to nodes (and skillIds) if skill is not added yet
            if (!skillIds.has(rec.skillId)) {
                skillIds.add(rec.skillId)
                const category = [...categories].indexOf(rec.progLang)
                nodes.push(
                    createNode('SKILL'+rec.skillId, 'SKILL', rec.skillName, rec.score, rec.ranking, category, 
                               getSymbolSize(selectedResourceType, 'SKILL', maxScore, minScore, rec.score), rec.score, rec.nrOfChangedLines, 
                               skillSymbol, {}, rec.skillLocation )
                )
            }
            // adding to links
            links.push({
                source: 'DEVELOPER'+rec.developerId,
                target: 'SKILL'+rec.skillId,
                score: rec.score,
                nrOfChangedLines: rec.nrOfChangedLines,
                ranking: rec.ranking
            })
        }
        const sortFunc = (a: any, b: any) => {
            let aText: string = a.type + (a.type === 'SKILL' ? a.location : a.name)
            let bText: string = b.type + (b.type === 'SKILL' ? b.location : b.name)
            return aText.localeCompare(bText)
        }
        return {
            nodes: nodes.sort((a,b) => sortFunc(a,b)),
            links: links,
            categories: [...categories].map(r => { return { 'name': r }})
        }
    }

    useEffect(() => {
        if (developerSkillMap && developerSkillMap.length > 0) {
            const graphData = transformData(developerSkillMap)

            if (graph) {
                graph.clear()
                graph.dispose()
            }
            graph = init(graphRef.current, null, {
                renderer: 'canvas',
                useDirtyRect: false
            })
            graph.setOption(getGraphOption(graphData, 0.2), { notMerge: false, lazyUpdate: true })

            window.addEventListener('resize', () => resizeGraph(graph))
        } else {
            if (graph) {
                graph.clear()
                graph.dispose()
            }
        }
    }, [ developerSkillMap ])

    return (
        <div className='loadingParent container-fluid'>
            {isDeveloperSkillMapLoading &&
                <Loading message='Loading the developer-skill graph.' />
            }
            {!isDeveloperSkillMapLoading && !errorMessageDeveloperSkillMap &&
                <>
                    {developerSkillMap && developerSkillMap.length > 0 &&
                        <div>
                            <label className='me-1'>Filtering by developer:</label>
                            <Form.Select className='w-auto me-3 d-lg-inline' onChange={e => selectNode(e, graph)} size='sm'>
                                <option value='-1' key='-1'>---</option>
                                { (transformData(developerSkillMap).nodes as any[]).map((rec, index) => (
                                    <>
                                        {rec.type === 'DEVELOPER' &&
                                            <option value={index} key={index}>{rec.name}</option>
                                        }
                                    </>
                                ))}
                            </Form.Select>
                            <label className='me-1'>Filtering by skill:</label>
                            <Form.Select className='w-auto d-lg-inline' onChange={e => selectNode(e, graph)} size='sm'>
                                <option value='-1' key='-1'>---</option>
                                { (transformData(developerSkillMap).nodes as any[]).map((rec, index) => (
                                    <>
                                        {rec.type === 'SKILL' &&
                                            <option value={index} key={index}>{rec.location}</option>
                                        }
                                    </>                                
                                ))}
                            </Form.Select>
                            <HiOutlinePlus onClick={() => zoom('+', transformData, developerSkillMap, getGraphOption, graph)} size={22} style={{cursor: 'pointer', color: 'gray'}} className='float-end me-1' title='Zooming in' />
                            <HiOutlineMinus onClick={() => zoom('-', transformData, developerSkillMap, getGraphOption, graph)} size={22} style={{cursor: 'pointer', color: 'gray'}} className='float-end' title='Zooming out' />
                        </div>
                    }
                    <div ref={graphRef} style={{ width: "100%", height: "80vh" }} id='developerSkillGraph' className='mt-2'/>
                </>
            }
        </div>
    )
}

export default DeveloperSkillGraph
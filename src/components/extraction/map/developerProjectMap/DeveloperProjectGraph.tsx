import { ReactElement, useEffect, useRef } from 'react';
import Loading from '../../../../utils/Loading';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import { ECharts, EChartsOption, init } from 'echarts';
import Form from 'react-bootstrap/Form'
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi2'
import { DeveloperProjectMapType } from '../../../../context/AppTypes';
import { buildTr, formatLinkLabel, formatNodeLabel, formatScoreValue, getSymbolSize, resizeGraph, selectNode, zoom } from '../MapFunctions';

type PropsType = {
    selectedResourceType: string
}

const DeveloperProjectGraph = ({ selectedResourceType }: PropsType): ReactElement => {
    const developerSymbol = 'path://M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z'
    const projectSymbol = 'path://m 237.4297,701.86214 0,40 -186,0 0,49.6914 -51.4297,0 0,211.30866 400,0 0,-300.00006 0,-1 -137.5703,0 z m 25,25 112.5703,0 0,251 -50,0 0,-185.42 -0.1621,0 0,-0.8886 -248.4082,0 0,-24.6914 186,0.9453 z'

    const { isDeveloperProjectMapLoading, errorMessageDeveloperProjectMap, developerProjectMap } = useExtractionMap()

    const graphRef = useRef<HTMLDivElement>(null)

    let graph: ECharts | null = null

    const formatTooltip = (params: any): string => {
        if (!params.data.type) {
            return `<table>${buildTr('Score:', formatScoreValue(params.data.score))}
                           ${buildTr('Nr of changed lines:', params.data.nrOfChangedLines)}</table>`
        } else {
            if (params.data.type === 'DEVELOPER') {
                return `<table>${buildTr('Type:', params.data.type)}
                               ${buildTr('Name:', params.data.name)}</table>`
            } else {
                return `<table>${buildTr('Type:', params.data.type)}
                               ${buildTr('Name:', params.data.name)}
                               ${buildTr('Description:', params.data.desc ?? '')}
                               ${buildTr('Created at:', params.data.projectCreatedAt ?? '')}
                               ${buildTr('HTTP URL to repo:', params.data.projectHttpUrlToRepo ?? '')}
                               ${buildTr('Path:', params.data.projectPath ?? '')}</table>`
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
                        'value': '',
                        'label': {
                            'show': showLabelOnLinks,
                            formatter: (params: any) => {
                                return formatLinkLabel(params)
                            }
                        }
                    }
                }),
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
                    width: 150,
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

    const createNode = (id: string, type: string, name: string, value: number, symbolSize: number, score: number, nrOfChangedLines: number, 
                        symbol: string, itemStyle: any, attributes?: {}): any => {
        return {
            id: id,
            type: type,
            name: name,
            value: value,
            symbolSize: symbolSize,
            symbol: symbol,
            itemStyle: itemStyle,
            score: score,
            nrOfChangedLines: nrOfChangedLines,
            ...attributes
        }
    }

    const transformData = (developerProjectMap: DeveloperProjectMapType[]): any => {
        let nodes: any[] = []
        let developerIds = new Set<number>()
        let projectIds = new Set<number>()
        let links: any[] = []
        const scoreArray: number[] = developerProjectMap.map(r => r.score)
        const maxScore: number = Math.max(...scoreArray)
        const minScore: number = Math.min(...scoreArray)
        for(const rec of developerProjectMap) {
            // adding to nodes (and developerIds) if developer is not added yet
            if (!developerIds.has(rec.developerId)) {
                developerIds.add(rec.developerId)
                nodes.push(
                    createNode('DEVELOPER'+rec.developerId, 'DEVELOPER', rec.developerName + ' (' + rec.developerEmail + ')', 
                               rec.score, getSymbolSize(selectedResourceType, 'DEVELOPER', maxScore, minScore, rec.score), 
                               rec.score, rec.nrOfChangedLines, developerSymbol, { color: 'red' } )
                )
            }
            // adding to nodes (and projectIds) if project is not added yet
            if (!projectIds.has(rec.projectId)) {
                projectIds.add(rec.projectId)
                nodes.push(
                    createNode('PROJECT'+rec.projectId, 'PROJECT', rec.projectName, rec.score,  
                               getSymbolSize(selectedResourceType, 'PROJECT', maxScore, minScore, rec.score), rec.score, rec.nrOfChangedLines, 
                               projectSymbol, { color: 'green' }, 
                               { projectCreatedAt: rec.projectCreatedAt, projectDesc: rec.projectDesc, projectHttpUrlToRepo: rec.projectHttpUrlToRepo, projectPath: rec.projectPath } )
                )
            }
            // adding to links
            links.push({
                source: 'DEVELOPER'+rec.developerId,
                target: 'PROJECT'+rec.projectId,
                score: rec.score,
                nrOfChangedLines: rec.nrOfChangedLines
            })
        }
        const sortFunc = (a: any, b: any) => {
            let aText: string = a.type + a.name
            let bText: string = b.type + b.name
            return aText.localeCompare(bText)
        }
        return {
            nodes: nodes.sort((a,b) => sortFunc(a,b)),
            links: links,
        }
    }

    useEffect(() => {
        if (developerProjectMap && developerProjectMap.length > 0) {
            const graphData = transformData(developerProjectMap)

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
    }, [ developerProjectMap ])

    return (
        <div className='loadingParent container-fluid'>
            {isDeveloperProjectMapLoading &&
                <Loading message='Loading the developer-project graph.' />
            }
            {!isDeveloperProjectMapLoading && !errorMessageDeveloperProjectMap &&
                <>
                    {developerProjectMap && developerProjectMap.length > 0 &&
                        <div>
                            <label className='me-1'>Filtering by developer:</label>
                            <Form.Select className='w-auto me-3 d-lg-inline' onChange={e => selectNode(e, graph)} size='sm'>
                                <option value='-1' key='-1'>---</option>
                                { (transformData(developerProjectMap).nodes as any[]).map((rec, index) => (
                                    <>
                                        {rec.type === 'DEVELOPER' &&
                                            <option value={index} key={index}>{rec.name}</option>
                                        }
                                    </>
                                ))}
                            </Form.Select>
                            <label className='me-1'>Filtering by project:</label>
                            <Form.Select className='w-auto d-lg-inline' onChange={e => selectNode(e, graph)} size='sm'>
                                <option value='-1' key='-1'>---</option>
                                { (transformData(developerProjectMap).nodes as any[]).map((rec, index) => (
                                    <>
                                        {rec.type === 'PROJECT' &&
                                            <option value={index} key={index}>{rec.name}</option>
                                        }
                                    </>                                
                                ))}
                            </Form.Select>
                            <HiOutlinePlus onClick={() => zoom('+', transformData, developerProjectMap, getGraphOption, graph)} size={22} style={{cursor: 'pointer', color: 'gray'}} className='float-end me-1' title='Zooming in' />
                            <HiOutlineMinus onClick={() => zoom('-', transformData, developerProjectMap, getGraphOption, graph)} size={22} style={{cursor: 'pointer', color: 'gray'}} className='float-end' title='Zooming out' />
                        </div>
                    }
                    <div ref={graphRef} style={{ width: "100%", height: "80vh" }} id='developerProjectGraph' className='mt-2'/>
                </>
            }
        </div>
    )
}

export default DeveloperProjectGraph
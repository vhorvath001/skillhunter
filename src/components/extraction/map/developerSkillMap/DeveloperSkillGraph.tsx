import { ChangeEvent, ReactElement, useEffect, useRef } from 'react';
import Loading from '../../../../utils/Loading';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import { ECharts, EChartsOption, GraphSeriesOption, init } from 'echarts';
import { DeveloperSkillMapType } from '../../../../context/AppTypes';
import Form from 'react-bootstrap/Form'

const DeveloperSkillGraph = (): ReactElement => {
    const developerSymbol = 'path://M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z'
    const skillSymbol = 'path://M 2,3 C 1.4477381,3.0000552 1.0000552,3.4477381 1,4 v 20 c 5.52e-5,0.552262 0.4477381,0.999945 1,1 h 28 c 0.552262,-5.5e-5 0.999945,-0.447738 1,-1 V 4 C 30.999945,3.4477381 30.552262,3.0000552 30,3 Z m 14,18 c 0.552285,0 1,0.447715 1,1 0,0.552285 -0.447715,1 -1,1 -0.552285,0 -1,-0.447715 -1,-1 0,-0.552285 0.447715,-1 1,-1 z m -1,5 v 1.001953 h -3.099609 c -1.334635,0.06901 -1.23112,2.070963 0.103515,2.001953 h 7.994141 c 1.334635,0 1.334635,-2.001953 0,-2.001953 H 17 V 26 Z'

    const { isDeveloperSkillMapLoading, errorMessageDeveloperSkillMap, developerSkillMap, selectedResourceType } = useExtractionMap()

    const graphRef = useRef<HTMLDivElement>(null)

    let graph: ECharts | null = null

    function formatLinkLabel(params: any) {
        return params.value
    }

    function formatNodeLabel(params: any) {
        return params.name
    }

    function formatTooltip(params: any) {
        if (!params.data.type) {
            return `<table><tr><td><b>Ranking:&nbsp;</b></td><td>${params.data.value}</td></tr><tr><td><b>Score:&nbsp;</b></td><td>${params.data.score}</td></tr><tr><td><b>Nr of changed lines:&nbsp;</b></td><td>${params.data.nrOfChangedLines}</td></tr></table>`
        } else {
            const location: string = params.data.type === 'SKILL' ? `<tr><td><b>Location:&nbsp;</b></td><td>${params.data.location ?? ''}</td></tr>` : ''
            if (selectedResourceType === 'ALL' || selectedResourceType === params.data.type) {
                return `<table><tr><td><b>Type:&nbsp;</b></td><td>${params.data.type}</td></tr><tr><td><b>Name:&nbsp;</b></td><td>${params.data.name}</td></tr>${location}</table>`
            } else {
                return `<table><tr><td><b>Type:&nbsp;</b></td><td>${params.data.type}</td></tr><tr><td><b>Name:&nbsp;</b></td><td>${params.data.name}</td></tr>${location}<tr><td><b>Ranking:&nbsp;</b></td><td>${params.data.ranking}</td></tr><tr><td><b>Score:&nbsp;</b></td><td>${params.data.value}</td></tr><tr><td><b>Nr of changed lines:&nbsp;</b></td><td>${params.data.nrOfChangedLines}</td></tr></table>`
            }
        }
    }

    const getGraphOption = (data: any, zoom: number): EChartsOption => {
        const showLabelOnLinks: boolean = data.links.length < 100

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
                        'value': getRankingByDeveloperId(l.source, data.nodes),
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

    const selectNode = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== '-1') {
            graph?.dispatchAction({
                type: 'highlight',
                dataIndex: [e.target.value],
            })
        }
    }

    const zoom = (inOut: string) => {
        const graphData = transformData(developerSkillMap!)

        const option = graph?.getOption() as EChartsOption
        const series = option?.series as GraphSeriesOption[]
        let _zoomValue = series[0].zoom ?? 0.2
        if (inOut === '+') {
            _zoomValue += 0.05
            if (_zoomValue >= 1.0)
                _zoomValue = 1
        } else {
            _zoomValue -= 0.05
            if (_zoomValue <= 0.04)
                _zoomValue = 0.04
        }
        graph?.setOption(getGraphOption(graphData, _zoomValue), { notMerge: false, lazyUpdate: true })
    }

    const resizeGraph = (): void => {
        graph?.resize()
    }

    const getSymbolSize = (selectedResourceType: string, currentResourceType: string, maxScore: number, minScore: number, score: number): number => {
        const minSize: number = 20
        const maxSize: number = 70
        if (selectedResourceType === currentResourceType)
            return 40
        else {
            // for example: the score is 35500, minScore is 15000, maxScore is 50000, the size can be between 20 and 40 => 
            // 1 point between 20 and 40 means 35000/20=1750 value distance between 15000 and 50000 => (35500-15000)/1750=11.7142 has to be added to 20 find the symbol size: 31.7142
            const onePintDistanceinScore: number = (maxScore - minScore) / (maxSize - minSize)
            return minSize + ( (score - minScore) / onePintDistanceinScore )
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
                nrOfChangedLines: rec.nrOfChangedLines
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

    const getRankingByDeveloperId = (developerId: string, nodes: any[]): string => {
        return nodes.find(r => r.type === 'DEVELOPER' && r.id === developerId).ranking
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

            window.addEventListener('resize', resizeGraph)
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
                    {developerSkillMap &&
                        <>
                            Filtering by developer:
                            <Form.Select className='w-auto mb-2 d-lg-inline' onChange={selectNode}>
                                <option value='-1' key='-1'>---</option>
                                { (transformData(developerSkillMap).nodes as any[]).map((rec, index) => (
                                    <>
                                        {rec.type === 'DEVELOPER' &&
                                            <option value={index} key={index}>{rec.name}</option>
                                        }
                                    </>
                                ))}
                            </Form.Select>
                            Filtering by skill:
                            <Form.Select className='w-auto mb-2 d-lg-inline' onChange={selectNode}>
                                <option value='-1' key='-1'>---</option>
                                { (transformData(developerSkillMap).nodes as any[]).map((rec, index) => (
                                    <>
                                        {rec.type === 'SKILL' &&
                                            <option value={index} key={index}>{rec.location}</option>
                                        }
                                    </>                                
                                ))}
                            </Form.Select>
                            <button onClick={() => zoom('+')}>+</button>
                            <button onClick={() => zoom('-')}>-</button>
                        </>
                    }
                    <div ref={graphRef} style={{ width: "100%", height: "80vh" }} id='developerSkillGraph' />
                </>
            }
        </div>
    )
}

export default DeveloperSkillGraph
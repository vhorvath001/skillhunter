import { ReactElement, useEffect, useRef } from 'react';
import Loading from '../../../../utils/Loading';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import { ECharts, EChartsOption, init } from 'echarts';
import { DeveloperSkillMapType } from '../../../../context/AppTypes';

const DeveloperSkillGraph = (): ReactElement => {
    const { isDeveloperSkillMapLoading, errorMessageDeveloperSkillMap, developerSkillMap } = useExtractionMap()

    const graphRef = useRef<HTMLDivElement>(null)

    let graph: ECharts | null = null

    function resizeChart() {
        graph?.resize()
    }

    const transformData = (developerSkillMap: DeveloperSkillMapType[]): any => {
        let nodes: any[] = []
        let developerIds = new Set<number>()
        let skillIds = new Set<number>()
        let links: any[] = []
        let categories = new Set<string>()
        for(const rec of developerSkillMap) {
            // adding to categories if prog lang is not added yet
            if (!categories.has(rec.progLang)) {
                categories.add(rec.progLang)
            }
            // adding to nodes (and developerIds) if developer is not added yet
            if (!developerIds.has(rec.developerId)) {
                developerIds.add(rec.developerId)
                nodes.push({
                    id: 'DEVELOPER'+rec.developerId,
                    type: 'DEVELOPER',
                    name: rec.developerName + ' (' + rec.developerEmail + ')',
                    value: rec.ranking + ' (' + rec.score + ')',
                    ranking: rec.ranking,
                    category: [...categories].indexOf(rec.progLang)
                })
            }
            // adding to nodes (and skillIds) if skill is not added yet
            if (!skillIds.has(rec.skillId)) {
                skillIds.add(rec.skillId)
                nodes.push({
                    id: 'SKILL'+rec.skillId,
                    type: 'SKILL',
                    name: rec.skillName,
                    value: rec.ranking + ' (' + rec.score + ')',
                    ranking: rec.ranking,
                    category: [...categories].indexOf(rec.progLang)
                })
            }
            // adding to links
            links.push({
                source: rec.developerId,
                target: rec.skillId
            })
        }
        return {
            nodes: nodes,
            links: links,
            categories: categories
        }
    }

    const getRankingByDeveloperId = (developerId: string, nodes: any[]): string => {
        // console.log('nodes: ', nodes)
        // console.log('developerId: ', developerId)
        return nodes.find(r => r.type === 'DEVELOPER' && r.id === developerId).ranking
    }

    useEffect(() => {
        if (developerSkillMap && developerSkillMap.length > 0) {
            const data = transformData(developerSkillMap)
            //console.log('data: ', data)

            function format(params: any) {
                return '--'+params.value+'--'
            }

            const option: EChartsOption = {
                title: {
                    text: 'Developer-Skill graph',
                    subtext: '?????????????',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    data: data.categories
                }],
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [{
                    name: 'Les Miserables',
                    type: 'graph',
                    legendHoverLink: false,
                    layout: 'none',
                    data: data.nodes,
                    links: data.links.map((l: any) => {
                        // console.log('data.links.map: ', l)
                        return {
                            ...l,
                            'value': getRankingByDeveloperId('DEVELOPER'+l.source, data.nodes),
                            'label': {
                                'show': true,
                                //formatter: '{@score}'
                                formatter: (params: any) => {
                                    return format(params)
                                }
                            }
                        }
                    }),
                    categories: data.categories,
                    roam: true,
                    label: {
                        position: 'right',
                        formatter: '{b}'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 10
                        }
                    }
                }]
            }



            // graph = init(graphRef.current, 'light')

            // graph.setOption(option)


            var dom = document.getElementById('developerSkillGraph');
            var myChart = init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
            });
            myChart.setOption(option)


            window.addEventListener("resize", resizeChart)
        } else {
            if (graph) {
                graph.clear()
                graph.dispose()
            }
        }
    }, [developerSkillMap])

    return (
        <div className='loadingParent container-fluid'>
            {isDeveloperSkillMapLoading &&
                <Loading message='Loading the developer-skill graph.' />
            }
            {!isDeveloperSkillMapLoading && !errorMessageDeveloperSkillMap &&
                <div ref={graphRef} style={{ width: "100%", height: "500px" }} id='developerSkillGraph' />
            }
        </div>
    )
}

export default DeveloperSkillGraph
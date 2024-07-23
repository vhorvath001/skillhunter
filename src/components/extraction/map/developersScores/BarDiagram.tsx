import { ReactElement, useEffect, useRef } from 'react'
import Loading from '../../../../utils/Loading'
import { ECharts, graphic, init } from 'echarts'
import { ECBasicOption } from 'echarts/types/dist/shared'
import AlertMessage from '../../../../utils/AlertMessage'
import useExtractionMap from '../../../../hooks/useExtractionMap'

const BarDiagram = (): ReactElement => {
    const { isDevelopersScoresLoading, developersScores, developersScoresErrorMessage } = useExtractionMap()

    const diagramRef = useRef<HTMLDivElement>(null)

    let diagram: ECharts|null = null
    function resizeChart() {
        diagram?.resize()
    }

    useEffect(() => {
        if (developersScores.length > 0) {
            const dataAxis: string[] = developersScores.map(ds => ds.developerName)
            let data: number[] = developersScores.map(ds => ds.totalScore)
            let yMax: number = 500
            let dataShadow: number[] = []
            for (let i = 0; i < data.length; i++) {
                dataShadow.push(yMax)
            }
            const option: ECBasicOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: {
                    data: dataAxis,
                    axisTick: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    name: 'Scores',
                    axisTick: {
                        show: false
                    },
                },
                dataZoom: [
                    {
                        show: true,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        showBackground: true,
                        itemStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#2378f7' },
                                    { offset: 0.7, color: '#2378f7' },
                                    { offset: 1, color: '#83bff6' }
                                ])
                            }
                        },
                        data: data,
                        animationDelay: function (idx: number) {
                            return idx * 10;
                        }
                    }
                ]
            }

            // Enable data zoom when user click bar.
            const zoomSize = 6
            diagram = init(diagramRef.current, 'light')

            diagram.on('click', function (params) {
                diagram!.dispatchAction({
                    type: 'dataZoom',
                    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                    endValue:
                        dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                });
            });


            diagram.setOption(option)

            window.addEventListener("resize", resizeChart)
        }

        // Return cleanup function
        return () => {
            diagram?.dispose()
            window.removeEventListener("resize", resizeChart)
        }
    }, [developersScores])

    return (
        <>
            <div className='loadingParent container-fluid'>
                {isDevelopersScoresLoading &&
                    <Loading message="Loading the Developers' cards diagram." />
                }
                {!isDevelopersScoresLoading && developersScoresErrorMessage &&
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
                        <AlertMessage errorMessage={developersScoresErrorMessage} />
                    </div>
                }
                {!isDevelopersScoresLoading && !developersScoresErrorMessage &&
                    <div ref={diagramRef} style={{ width: "100%", height: "500px" }} id='aa'/>
                }
            </div>
        </>
    )
}

export default BarDiagram
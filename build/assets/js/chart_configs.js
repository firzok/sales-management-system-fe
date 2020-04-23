const plugin = {
    datalabels: {
        align: function(context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index];
            var invert = Math.abs(value) <= 1;
            return value < 1 ? 'end' : 'start'
        },
        anchor: 'end',
        backgroundColor: null,
        borderColor: null,
        borderRadius: 4,
        borderWidth: 1,
        color: 'white',
        font: {
            size: 12,
            weight: 400
        },
        offset: 5,
        padding: 0
    }
}

export const config = {
    options: {
        title: {
            display: false,
        },
        plugins: plugin,
        tooltips: {
            intersect: false,
            mode: 'nearest',
            label: 'mylabel',
        },
        legend: {
            display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false,
                display: false,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                    fontSize: 14,
                    maxRotation: 90
                }
            }],
            yAxes: [{
                stacked: false,
                display: false,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                    beginAtZero: true,
                }
            }]
        },
        elements: {
            line: {
                tension: 0.0000001
            },
            point: {
                radius: 4,
                borderWidth: 12
            }
        },

        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    },
    optionsForLabelsY: {
        title: {
            display: false,
        },
        plugins: plugin,
        tooltips: {
            intersect: false,
            mode: 'nearest',
            label: 'mylabel',
        },
        legend: {
            display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false,
                display: false,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                    fontSize: 14,
                    maxRotation: 90
                }
            }],
            yAxes: [{
                stacked: false,
                display: true,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                    beginAtZero: true,
                }
            }]
        },
        elements: {
            line: {
                tension: 0.0000001
            },
            point: {
                radius: 4,
                borderWidth: 12
            }
        },

        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    },
    optionsForLabelsX: {
        title: {
            display: false,
        },
        plugins: plugin,
        tooltips: {
            intersect: false,
            mode: 'nearest',
            label: 'mylabel',
        },
        legend: {
            display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: false,
                display: true,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                    fontSize: 14,
                    maxRotation: 90
                }
            }],
            yAxes: [{
                stacked: false,
                display: false,
                gridLines: {
                    display: false
                },
                scaleLabel: {
                    display: false,
                },
                ticks: {
                    padding: 10,
                    beginAtZero: true,
                }
            }]
        },
        elements: {
            line: {
                tension: 0.0000001
            },
            point: {
                radius: 4,
                borderWidth: 12
            }
        },

        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    },
    pieFullOptions: {
        responsive: true,
        plugins: plugin,
        legend: {
            display: false,  
            position: 'bottom'
        },
        animation: {
          animateRotate: false,
          animateScale: true
        }
    },
    pieHalfOptions: {
        responsive: true,
        plugins: plugin,
        rotation: -Math.PI,
        cutoutPercentage: 30,
        circumference: Math.PI,
        legend: {
          display: true,  
          position: 'bottom'
        },
        animation: {
          animateRotate: false,
          animateScale: true
        }
    },
    pieFullOptionsWithLegends: {
        responsive: true,
        plugins: plugin,
        legend: {
            display: true,  
            position: 'top'
        },
        animation: {
          animateRotate: false,
          animateScale: true
        } 
    }
};
import { template } from "@babel/core";
import { useEffect, useRef, useState } from "react";
import { NUM_ROWS } from "./utils/globals";

interface SliceProps {
    percent: number,
}

interface chartProps {
    message: boolean
}

const getWins = () => {
    let wins = 0;
    for (let i = 1; i <= NUM_ROWS; i++) {
        let temp = localStorage.getItem(`win${i}`);
        wins += JSON.parse(temp).num;
    }
    return wins;
}

const getStreak = () => {
    let streak = localStorage.getItem('streak');
    if (streak !== null) return JSON.parse(streak).num;
    else return 0;
}

const Chart = ({message}: chartProps) => {
    const [empty, setEmpty] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [template, setTemplate] = useState(false);
    const slices = useRef<SliceProps[]>([])
    const indvWins = useRef<number[]>([])
    const attempts = [1, 2, 3, 4, 5, 6];
    let losses: number = JSON.parse(localStorage.getItem('losses')).num;

    useEffect(() => {
        if (getWins() > 0) {
            document.getElementById('middle').classList.add('middle-rotate')
            document.getElementById('slices').classList.add('pie-chart-rotate')
            setTimeout(() => {
                document.getElementById('middle').classList.remove('middle-rotate')
                document.getElementById('slices').classList.remove('pie-chart-rotate')
                setSpinning(true);
            }, 1000)
            setTimeout(() => {
                setTemplate(true)
            }, 2000)
        }
    }, [])

    useEffect(() =>{
    }, [empty])

    const clear = (id: number) => {
        let temp = [];
        for (let i = 1; i <= NUM_ROWS; i++) {
            if (i !== id) temp.push(i);
        }
        setEmpty(temp);
    }

    const fill = () => {
        setEmpty([])
    }

    const check = (id: number) => {
        if (empty.includes(id)) return '20%'
        return '100%'
    }

    const fontCheck = (id: number): string => {
        if (empty.includes(id) || empty.length === 0) return '';
        return `table-cell-${id}`;
    }

    const bgCheck = (id: number): string => {
        if (empty.includes(id) || empty.length === 0) return 'table-standard';
        return `table-div-${id}`;
    }
    
    const barWidth = (percentage: number) => {
        return (percentage * 200) * .9;
    }

    const slice = () => {
        slices.current = [];
        let wins = getWins();

        indvWins.current = [];
        for (let i = 1; i <= NUM_ROWS; i++) {
            let temp = localStorage.getItem(`win${i}`);
            indvWins.current = [...indvWins.current, JSON.parse(temp).num];
        }

        for (let i = 0; i < indvWins.current.length; i++) {
            slices.current = [...slices.current, {percent: indvWins.current[i]/wins}]
        }
    
        let cumulativePercent = 0;
    
        function getCoordinatesForPercent(percent: number) {
          const x = Math.cos(2 * Math.PI * percent);
          const y = Math.sin(2 * Math.PI * percent);
          return [x, y];
        }
    
        let arr = [];
        let idx = 1;
        arr = slices.current.map((slice, index) => {
          const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
          cumulativePercent += slice.percent;
          const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
          const largeArcFlag = slice.percent > 0.5 ? 1 : 0;
          const pathData = [
            `M ${startX} ${startY}`, // Move
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            'L 0 0', // Line
          ].join(' ');
          return <path d={pathData} fillOpacity={check(idx)} key={index} onMouseOver={() => clear(index + 1)} onMouseLeave={() => fill()} className={`path-${idx++}`}/>;
        });
        return arr;
      }

    return (
        <div className="pie-container">
            <div className="stats-header">
                {message && 'STATISTICS'}
                <div className='stats-container'>
                    <div className='stats-unit'>
                        <div className="stats-large">{getWins() + losses}</div>
                        <div className="stats-small">Played</div>
                    </div>
                    <div className='stats-unit'>
                        {getWins() > 0 ?
                            <div className="stats-large">{Math.ceil((getWins()/(getWins() + losses)*100))}</div>
                            : <div className="stats-large">{0}</div>
                        }
                        <div className="stats-small">Win %</div>
                    </div>
                    <div className='stats-unit'>
                        <div className="stats-large">{getStreak()}</div>
                        <div className="stats-small">Streak</div>
                    </div>
                </div>
            </div>
            {(getWins() > 0) ?
                <div className="pie-chart">
                    <svg className='pie-svg' viewBox="-1 -1 2 2" id='slices'>
                    {slice()}
                    </svg>
                    <div className="pie-middle" id="middle">
                        {!spinning ? 
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-trophy-fill" viewBox="0 0 16 16">
                                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                                </svg>
                            </div> :
                            <div className="record-container">
                                <div className="attempts"> ATTEMPTS </div>
                                <table className='pie-table'>
                                    <tbody>
                                        {attempts.map((attempt, index)=> {
                                            return (
                                                <tr key={index}>
                                                    <td className={fontCheck(index + 1)}>
                                                        {attempt}
                                                        <div className={bgCheck(index + 1)} style={{width: `${barWidth(slices.current[index].percent)}px`, height: '15px'}}></div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {!template ? 
                                    <div className="record">W - L</div> :
                                    <div className="record">{getWins()} - {losses}</div>
                                }
                            </div>
                        }
                    </div>
                </div>
                : 
                <div className="pie-chart">No Data to Display</div>}
        </div>
    )
}

export default Chart
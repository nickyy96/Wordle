import Chart from "./Chart"
import ShareButton from "./ShareButton"

interface statsProps {
    win: boolean;
}

const Stats = ({win}: statsProps) => {
    return (
        <>
        <h1 className='modal-header'>
                STATISTICS
            </h1>
            <section className="modal-section">
                <Chart message={false}/>
            </section>
            <br></br>
            <ShareButton win={win}/>
        </>
    )
}

export default Stats
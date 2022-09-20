import Chart from "./Chart"

interface statsProps {

}

const Stats = ({}: statsProps) => {
    return (
        <>
        <h1 className='modal-header'>
                STATISTICS
            </h1>
            <section className="modal-section">
                <Chart message={false}/>
            </section>
            <div className="modal-footer">
                <p></p>
            </div>
        </>
    )
}

export default Stats
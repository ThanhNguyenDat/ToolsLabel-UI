import classNames from "classnames/bind";
import styles from './Matrix.module.scss'

import ObjeactDetection from "./MetricTable/ObjeactDetection";
import Classification from "./MetricTable/Classification";

const cx = classNames.bind(styles);


function Matrix( { values } ) {

    const choosedTypeMatrix = (values) => {
        // console.log('values.type: ', values.type);
        if (values.type === 'objectdetection') {
            return <ObjeactDetection values={values} />
        }
        else if (values.type === 'classification') {
            return <Classification values={values} />
        }
    }

    return ( 
        <div className={cx('wrapper')}>
            {choosedTypeMatrix(values)}
        </div> 
    );
}

export default Matrix;
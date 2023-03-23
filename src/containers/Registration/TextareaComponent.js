import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const ResizableNewTextarea = (props) => {
	const [state, setState] = useState({
		value: '',
		rows: 1,
		minRows: 1,
		maxRows: 10,
		firstTime: true,
		handleChange: false
	});
	const selectRef = useRef()

	useEffect(() => {
		if(selectRef.current && state.firstTime) {
			const textareaLineHeight = 24;
            const { minRows, maxRows, value } = state;

            let currentRows = ~~( selectRef.current.scrollHeight / textareaLineHeight);
			if(props.minRows > 1 && currentRows < props.minRows ) {
				currentRows = props.minRows || minRows;
			}
			if(currentRows > (props.maxRows || state.maxRows)) {
				currentRows = props.maxRows || state.maxRows;
			}
            if(currentRows == state.rows){
				setState({
					...state,
					firstTime: false
				}); 
                return;
            }
			
            setState({
				...state,
                rows: currentRows,
				firstTime: false
            }); 
		}

		if(selectRef.current && props.value && props.value != state.value && state.handleChange == false) {
			const textareaLineHeight = 24;
            const { minRows, maxRows, value } = state;

            let currentRows = ~~( selectRef.current.scrollHeight / textareaLineHeight);
			if(props.minRows > 1 && currentRows < props.minRows ) {
				currentRows = props.minRows || minRows;
			}
			if(currentRows > (props.maxRows || state.maxRows)) {
				currentRows = props.maxRows || state.maxRows;
			}
			setState({
				...state,
				value: props.value,
				rows: currentRows,
			})
		}
	}, [props.value, state.firstTime, selectRef, state.handleChange]);

	const handleChange = (event) => {
		const textareaLineHeight = 24;
		const {value} = state;
		const minRows = props.minRows || state.minRows;
		const maxRows = props.maxRows || state.maxRows
		const previousRows = event.target.rows;
  	    event.target.rows = minRows; // reset number of rows in textarea 
		
		let currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
		if(minRows > 1 && currentRows < minRows) {
			currentRows = minRows;
		}
        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }
		
		if (currentRows >= maxRows) {
			event.target.rows = maxRows;
			event.target.scrollTop = event.target.scrollHeight;
		}
		
    
        setState({
			...state,
            value: event.target.value,
            rows: currentRows < maxRows ? currentRows : maxRows,
            firstTime: false,
			handleChange: true
        });
        if(props.onChange){
            props.onChange(event);
        }
	};

	return (
		<textarea
			rows={state.rows}
			value={props.value}
			placeholder={props.placeholder || ''}
			className={'textarea ' + (props.className || '')}
			onChange={handleChange}
			ref={selectRef}
			disabled={props.disabled || false}
		/>
	);

}

class ResizableTextarea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			rows: 1,
			minRows: 1,
			maxRows: 10,
            firstTime: true
		};
	}
	
	handleChange = (event) => {
		const textareaLineHeight = 24;
		const {value} = this.state;
		const minRows = this.props.minRows || this.state.minRows;
		const maxRows = this.props.maxRows || this.state.maxRows
		const previousRows = event.target.rows;
  	    event.target.rows = minRows; // reset number of rows in textarea 
		
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
		if(minRows > 1 && currentRows < minRows) {
			currentRows = minRows;
		}
        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }
		
		if (currentRows >= maxRows) {
			event.target.rows = maxRows;
			event.target.scrollTop = event.target.scrollHeight;
		}
		
    
        this.setState({
            value: event.target.value,
            rows: currentRows < maxRows ? currentRows : maxRows,
            firstTime: false
        });
        if(this.props.onChange){
            this.props.onChange(event);
        }
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.minRows && nextProps.minRows > 1 && nextProps.minRows !== this.state.minRows) {
		  this.setState({ minRows: nextProps.minRows, rows: nextProps.minRows})
		}
	}

    processFirstTime(e){
		console.log('begin>>>>', this.props.value, this.state.firstTime);
        if(e && this.state.firstTime){
            const textareaLineHeight = 24;
            const { minRows, maxRows, value } = this.state;

            let currentRows = ~~( e.scrollHeight / textareaLineHeight);
			console.log('processFirstTime>>>', this.props.value, currentRows, this.props.minRows);
			if(this.props.minRows > 1 && currentRows < this.props.minRows ) {
				currentRows = this.props.minRows || minRows;
			}
            if(currentRows == this.state.rows){
				this.setState({
					firstTime: false
				}); 
                return;
            }
			
            this.setState({
                rows: currentRows,
				firstTime: false
            }); 
        }
    }

	render() {
		return (
			<textarea
				rows={this.state.rows}
				value={this.props.value}
				placeholder={this.props.placeholder || ''}
				className={'textarea ' + (this.props.className || '')}
				onChange={this.handleChange}
                ref={(e) => this.processFirstTime(e)}
                disabled={this.props.disabled || false}
			/>
		);
	}
}
export default ResizableNewTextarea;
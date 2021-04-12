import React from 'react';

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
		const { minRows, maxRows } = this.state;
		
		const previousRows = event.target.rows;
  	    event.target.rows = minRows; // reset number of rows in textarea 
		
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
    
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

    processFirstTime(e){
        if(e && this.state.firstTime){
            const textareaLineHeight = 24;
            const { minRows, maxRows } = this.state;
            const currentRows = ~~( e.scrollHeight / textareaLineHeight);
            if(currentRows == this.state.rows){
                return;
            }
            this.setState({
                rows: currentRows < maxRows ? currentRows : maxRows,
            }); 
        }
    }
	
	render() {
		return (
			<textarea
				rows={this.state.rows}
				value={this.props.value || this.state.value}
				placeholder={this.props.placeholder || ''}
				className={'textarea ' + (this.props.className || '')}
				onChange={this.handleChange}
                ref={(e) => this.processFirstTime(e)}
                disabled={this.props.disabled || false}
			/>
		);
	}
}
export default ResizableTextarea;
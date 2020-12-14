import React from 'react'

export default function withHoverDetection(WrappedComponent) {
    return class WithHoverDetection extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hovered: false }
            this.setHoverStatus = this.setHoverStatus.bind(this)
        }

        setHoverStatus(status) {
            this.setState({ hovered: status })
        }
      
        render() {
            return <div onMouseEnter={_ => this.setHoverStatus(true)} onMouseLeave={_ => this.setHoverStatus(false)}>
                <WrappedComponent hovered={this.state.hovered} {...this.props} />
            </div>
        }
    }
}
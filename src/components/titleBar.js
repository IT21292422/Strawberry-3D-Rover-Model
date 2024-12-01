import React, { Component } from 'react'

export default class TitleBar extends Component {
  render() {
    return (
        <div className='search-bar-container'>
              <div><h3><strong>Rover Demo</strong></h3></div>
            <details>
              <summary><strong>Click here for more detail</strong></summary>
                <details style={{paddingLeft:'1rem'}}>
                  <summary><strong>Rover movements</strong></summary>
                    <div style={{paddingLeft:'1rem'}}>Use <strong>W</strong> and <strong>S</strong> key to move the rover</div>
                </details>
                <details style={{paddingLeft:'1rem'}}>
                  <summary><strong>Click on Rover</strong></summary>
                    <div style={{paddingLeft:'1rem'}}>If you click on the Rover, alert will pop up</div>
                </details>
                <details style={{paddingLeft:'1rem'}}>
                  <summary><strong>Click on Pots</strong></summary>
                    <div style={{paddingLeft:'1rem'}}>If you click on a pot, alert will pop up with its index number</div>
                </details>
                <details style={{paddingLeft:'1rem'}}>
                  <summary><strong>Usage of Left mouse button</strong></summary>
                    <div style={{paddingLeft:'1rem'}}>Use Left mouse button to rotate the view(Click and rotate)</div>
                </details>
                <details style={{paddingLeft:'1rem'}}>
                  <summary><strong>Usage of Right mouse button</strong></summary>
                    <div style={{paddingLeft:'1rem'}}>Use Right mouse button to move the view(Click and move)</div>
                </details>
            </details>
        </div>
    )
  }
}

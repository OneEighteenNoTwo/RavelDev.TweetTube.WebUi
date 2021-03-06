import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import './Spinner.css';

export class GenericSpinner extends Component {
    static displayName = Spinner.name;

  constructor (props) {
    super(props);
  }


  render () {
      return (
          <div>
            <div class="d-flex justify-content-center mb-5 mt-5">
                <div class="p-2 spinner-border spinner-lg" role="status">
                </div>
              </div>
          </div>

    );
  }
}

/*
 * Minio Cloud Storage (C) 2018 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { READ_ONLY, WRITE_ONLY, READ_WRITE, NONE } from "../constants"

import React from "react"
import { connect } from "react-redux"
import * as actionsBuckets from "./actions"
import * as actionsAlert from "../alert/actions"
import web from "../web"

export class Policy extends React.Component {
  removePolicy(e) {
    e.preventDefault()
    const { currentBucket, prefix, fetchPolicies, showAlert } = this.props
    web
      .SetBucketPolicy({
        bucketName: currentBucket,
        prefix: prefix,
        policy: "none"
      })
      .then(() => {
        fetchPolicies(currentBucket)
      })
      .catch(e => showAlert("danger", e.message))
  }

  render() {
    const { policy, prefix } = this.props
    let newPrefix = prefix
    if (newPrefix === "") newPrefix = "*"

    if (policy === NONE) {
      return <noscript />
    } else {
      return (
        <div className="policy__item">
          {newPrefix}
          <small>{policy}</small>

          <i
            className="policy__item__remove"
            onClick={this.removePolicy.bind(this)}
          />
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    currentBucket: state.buckets.currentBucket
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchPolicies: bucket => dispatch(actionsBuckets.fetchPolicies(bucket)),
    showAlert: (type, message) =>
      dispatch(actionsAlert.set({ type: type, message: message }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Policy)

import React from 'react'
import { Link } from '../common/link'
import { Image } from '../common/image'

export class Logo extends React.Component {
    render() {
        return (
            <div className="mr-2">
                <Link href="#">
                    <Image src="/img/brand-admin.svg" />
                </Link>
            </div>
        )
    }
}
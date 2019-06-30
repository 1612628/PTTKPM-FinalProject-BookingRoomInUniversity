import React from 'react'
import { Link } from '../common/link'
import { Image } from '../common/image'

export class Logo extends React.Component {
    render() {
        return (
            <div className="mr-2 text-center py-4">
                <Link href="#">
                    <Image className='w-50' src="/img/logo-khtn.png" />
                </Link>
            </div>
        )
    }
}
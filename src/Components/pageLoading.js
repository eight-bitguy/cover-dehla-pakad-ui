import React from 'react';
import Spinner from "./spinner";

export default function PageLoading(props) {
    if (props.isLoading) {
        if (props.timedOut) {
            return <main>
                <p className='text-center'>
                    Sorry! There seems to be some issue. Please try reloading the page.
                </p>
            </main>;
        }
        else if (props.pastDelay) {
            return (
                <main>
                    <div className='loading-container text-center'>
                        <Spinner useDefaultColor={true} />
                    </div>
                </main>
            );
        }
        else {
            return <main />;
        }
    }
    else if (props.error) {
        return <main>
            <p className='text-center'>Sorry, there was a problem loading the page.</p>
        </main>;
    }
    else {
        return <main />;
    }
}

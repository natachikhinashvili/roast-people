import { useParams } from "react-router-dom"
import {gql, useQuery} from '@apollo/client'

export default function Comments(){
    const slug = useParams()
    const post = gql`
            query {
                post(id: "${slug.id}"){
                    title
                    creator {
                        name
                    }
                    likes
                    createdAt
                }
            }
        `
        const {error, loading, data} = useQuery(post)
        console.log(data,loading,error)

    return (
        <div></div>
    )
}
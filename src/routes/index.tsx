import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    loader: () => ({ pageName: "Home" }),
    component: Home,
})

function Home() {
    return (
        <div className="p-4 flex flex-col gap-4 text-gray-700 dark:text-gray-300">
            <div className="">
                <b>MY HOBBIES </b>is a web application for keeping track of books you have
                read/listened and movies you have watched.
            </div>

            <div className="flex flex-col gap-1">
                <div>After logging in you are able to:</div>
                <ul className="list-disc pl-8">
                    <li>Add an item (book or movie) to the list.</li>
                    <li>Modify an existing item.</li>
                    <li>Remove an item.</li>
                    <li>Perform search for specific item(s).</li>
                </ul>
            </div>

            <div className="flex flex-col gap-1">
                <div>Also you have the possibilities to:</div>
                <ul className="list-disc pl-8">
                    <li>Perform search for specific item(s).</li>
                    <li>Share data with other people.</li>
                </ul>
            </div>

            <div>Unathorized people can see the data shared by another users.</div>

            <hr className="border-1 border-gray-300 dark:border-gray-700" />

            <div>
                The latest version is a full-stack web application based on the TanStack Start framework
                <a href="https://tanstack.com/start/latest" target="_blank">&nbsp;&#x1F517;</a>.
                <br />
                It's an open-source project
                <a href="https://github.com/iurii-kyrylenko/my-hobbies-ssr" target="_blank">&nbsp;&#x1F517;</a>.
            </div>

            <hr className="border-1 border-gray-300 dark:border-gray-700" />

            <div>
                <div>The project has a long history:</div>
                <ul className="list-disc pl-8">
                    <li>The 1st version was implemented as the REST API NodeJS server and the VueJS SPA client
                        <a href="https://github.com/iurii-kyrylenko/hobbies" target="_blank">&nbsp;&#x1F517;</a>.
                        <br />
                        It's still alive<a href="https://ik-hobbies.onrender.com/" target="_blank">&nbsp;&#x1F517;</a>.
                    </li>
                    <li>The 2nd version was implemented as the Apollo GraphQL server
                        <a href="https://github.com/iurii-kyrylenko/hobbies-graphql" target="_blank">&nbsp;&#x1F517;</a>
                        &nbsp;and the Apollo GraphQL client
                        <a href="https://github.com/iurii-kyrylenko/hobbies-graphql-client" target="_blank">&nbsp;&#x1F517;</a>.
                        <br />
                        It's also still alive<a href="https://hobbies-graphql-client.onrender.com/" target="_blank">&nbsp;&#x1F517;</a>.
                    </li>
                </ul>
            </div>

            <div>All versions share the same MongoDB database.</div>

            <hr className="border-1 border-gray-300 dark:border-gray-700" />

            <div>
                Change log:
                <ul className="list-disc pl-8">
                    <li>
                        Mar 4, 2026: Deploy the full-stack application on <a href="https://vercel.com/" target="_blank">Vercel</a>.
                    </li>
                    <li>
                        May 18, 2024: Wire up the <a href="https://developers.google.com/books/docs/overview" target="_blank">Google Books API</a> service to obtain the book info.
                    </li>
                    <li>
                        May 14, 2024: Deploy new GraphQL projects on <a href="https://render.com/" target="_blank">Render</a>.
                    </li>
                    <li>
                        Nov 11, 2022: Deploy on <a href="https://render.com/" target="_blank">Render</a> (free hosting plan).
                    </li>
                    <li>
                        Sep 22, 2020: Migrate database from <a href="https://mlab.com" target="_blank">mLab</a> to <a href="https://www.mongodb.com/cloud/atlas" target="_blank">MongoDB Atlas</a>.
                    </li>
                    <li>
                        Sep 15, 2019: Handle errors from TMDb API. Update dependencies.
                    </li>
                    <li>
                        Nov 4, 2018: Filter out people without hobbies.
                    </li>
                    <li>
                        Nov 3, 2018: Update to latest versions of Vue.js and other libraries.
                    </li>
                    <li>
                        May 25, 2017: Change movie info service from <a href="http://www.omdbapi.com/" target="_blank">OMDb</a> to <a href="https://www.themoviedb.org/" target="_blank">TMDb</a>.
                    </li>
                    <li>
                        Apr 24, 2017: Wire up the <a href="http://www.omdbapi.com/" target="_blank">OMDb</a> api service to obtain the movie info.
                    </li>
                </ul>
            </div>

            <hr className="border-1 border-gray-300 dark:border-gray-700" />

            <small>This site is protected by reCAPTCHA and the Google
                <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                <a href="https://policies.google.com/terms">Terms of Service</a> apply.
            </small>
        </div>
    );
}

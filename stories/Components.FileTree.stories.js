import { html } from "./helpers.js";

export default {
  title: "Components/File tree",
  parameters: {
    docs: {
      description: {
        component:
          "Where something lives, as a shape rather than as a path. Guides are " +
          "drawn with a border on the nested list rather than with box " +
          "characters in the text, so the names stay selectable and searchable " +
          "as names.",
      },
    },
  },
};

export const Layout = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:520px">
      <h2>Where the statements are</h2>
      <ul class="filetree">
        <li class="ft-dir is-open">wp-admin
          <ul>
            <li class="ft-dir is-open">includes
              <ul>
                <li class="ft-file is-current"><a href="#">upgrade.php</a><span class="ft-note">162</span></li>
                <li class="ft-file"><a href="#">deprecated.php</a><span class="ft-note">57</span></li>
                <li class="ft-file"><a href="#">post.php</a><span class="ft-note">20</span></li>
              </ul>
            </li>
          </ul>
        </li>
        <li class="ft-dir is-open">wp-includes
          <ul>
            <li class="ft-file"><a href="#">post.php</a><span class="ft-note">49</span></li>
            <li class="ft-file"><a href="#">taxonomy.php</a><span class="ft-note">39</span></li>
            <li class="ft-dir">class-wp-query
              <ul><li class="ft-file"><a href="#">query.php</a><span class="ft-note">23</span></li></ul>
            </li>
          </ul>
        </li>
      </ul>
    </main></div></div>`,
};

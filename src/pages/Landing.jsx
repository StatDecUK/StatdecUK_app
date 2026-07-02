"
import { Link } from \"react-router-dom\";
import Layout from \"@/components/Layout\";
import { Button } from \"@/components/ui/button\";
import { ArrowRight, Check, Shield, FileText, Download } from \"lucide-react\";

export default function Landing() {
  return (
    <Layout>
      <section className=\"pt-12 pb-20 grid lg:grid-cols-12 gap-12 items-start\">
        <div className=\"lg:col-span-7\">
          <div className=\"text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6\">
            Statutory Declarations Act 1835 · United Kingdom
          </div>
          <h1
            className=\"font-serif-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-semibold tracking-tight mb-8\"
            data-testid=\"landing-headline\"
          >
            Statutory declarations,
            <br />
            drafted with{\" \"}
            <span className=\"italic font-normal text-neutral-700\">rigour</span>.
          </h1>
          <p className=\"text-lg text-neutral-600 leading-relaxed max-w-2xl mb-10\">
            Statuta is a professional workspace for solicitors, paralegals and
            commissioners for oaths. Draft, exhibit, witness and export court-grade
            statutory declarations — with nineteen vetted profiles and simultaneous
            multi-exhibit handling.
          </p>
          <div className=\"flex flex-wrap items-center gap-3\">
            <Link to=\"/register\">
              <Button className=\"rounded-sm bg-black hover:bg-neutral-800 h-12 px-6\" data-testid=\"cta-register\">
                Open free account <ArrowRight className=\"w-4 h-4 ml-2\" />
              </Button>
            </Link>
            <Link to=\"/login\">
              <Button variant=\"outline\" className=\"rounded-sm border-neutral-300 h-12 px-6\" data-testid=\"cta-login\">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
        <div className=\"lg:col-span-5\">
          <div className=\"border border-neutral-200 bg-white rounded-sm p-8 shadow-sm\">
            <div className=\"text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-4\">
              Specimen — Type 2
            </div>
            <div className=\"font-mono-doc text-xs leading-relaxed text-neutral-700\">
              STATUTORY DECLARATION{\"\n\"}
              (Under the Statutory Declarations Act 1835){\"\n\n\"}
              I, John Doe, of 123 High Street, Cardiff, CF10 1FF, occupying the position
              of Company Director, do solemnly and sincerely declare as follows:{\"\n\n\"}
              The Landlord intends to grant me a tenancy of premises at [Property
              Address]…
            </div>
            <div className=\"mt-6 pt-6 border-t border-dashed border-neutral-200 flex items-center justify-between text-xs text-neutral-500\">
              <span>Exhibit \"A\" referred to</span>
              <span>2 of 4 pages</span>
            </div>
          </div>
        </div>
      </section>

      <section className=\"grid md:grid-cols-3 gap-6 mt-8 pb-16\">
        {[
          {
            icon: FileText,
            title: \"19 vetted profiles\",
            body: \"Solvency, Tenant Act 1954, GRC, PE2/PE3, Probate and more — wording auto-fills, you refine.\",
          },
          {
            icon: Check,
            title: \"Multi-exhibit bundles\",
            body: \"Select A, B, C, D simultaneously. Each exhibit gets a proper cover sheet, automatically.\",
          },
          {
            icon: Download,
            title: \"Court-grade PDF & print\",
            body: \"Print clean A4 or download a single PDF with declaration + all exhibits — paginated.\",
          },
        ].map((f) => (
          <div
            key={f.title}
            className=\"border border-neutral-200 rounded-sm p-6 bg-white hover:shadow-md transition-shadow\"
            data-testid={`feature-${f.title.split(\" \")[0].toLowerCase()}`}
          >
            <f.icon className=\"w-5 h-5 text-neutral-900 mb-4\" strokeWidth={1.5} />
            <div className=\"font-serif-display text-xl mb-2\">{f.title}</div>
            <p className=\"text-sm text-neutral-600 leading-relaxed\">{f.body}</p>
          </div>
        ))}
      </section>

      <section className=\"border-t border-neutral-200 pt-12 pb-20\">
        <div className=\"flex items-start gap-3 text-xs text-neutral-500 max-w-3xl\">
          <Shield className=\"w-4 h-4 mt-0.5\" />
          <p>
            Statuta is a drafting tool. It does not replace legal advice from a qualified
            solicitor. Declarations must be made before a Commissioner for Oaths or
            authorised officer to take effect under the Statutory Declarations Act 1835.
          </p>
        </div>
      </section>
    </Layout>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Landing.jsx

Now the Dashboard, Editor, Landing, and App.js:
Action: file_editor create /app/frontend/src/pages/Dashboard.jsx --file-text "import { useEffect, useState } from \"react\";
import { Link, useNavigate } from \"react-router-dom\";
import Layout from \"@/components/Layout\";
import { api, extractError } from \"@/lib/api\";
import { Button } from \"@/components/ui/button\";
import { Card } from \"@/components/ui/card\";
import { Plus, FileText, Trash2, Pencil, Calendar } from \"lucide-react\";
import { toast } from \"sonner\";
import { getTypeLabel } from \"@/lib/legalDatabase\";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from \"@/components/ui/alert-dialog\";

export default function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function load() {
    try {
      const { data } = await api.get(\"/declarations\");
      setItems(data);
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await api.delete(`/declarations/${pendingDelete.id}`);
      toast.success(\"Declaration deleted\");
      setItems((prev) => prev.filter((x) => x.id !== pendingDelete.id));
    } catch (e) {
      toast.error(extractError(e));
    }
    setPendingDelete(null);
  }

  return (
    <Layout>
      <div className=\"flex items-end justify-between mb-10 pb-6 border-b border-neutral-200\">
        <div>
          <div className=\"text-xs uppercase tracking-[0.25em] text-neutral-500 mb-2\">
            Workspace
          </div>
          <h1 className=\"font-serif-display text-5xl font-semibold tracking-tight\" data-testid=\"dashboard-title\">
            Saved declarations
          </h1>
          <p className=\"text-neutral-600 mt-3 max-w-xl\">
            All statutory declarations and exhibit bundles drafted with your account.
            Print, download or revise at any time.
          </p>
        </div>
        <Button
          onClick={() => navigate(\"/editor\")}
          className=\"rounded-sm bg-black hover:bg-neutral-800 h-11 px-5\"
          data-testid=\"new-declaration-button\"
        >
          <Plus className=\"w-4 h-4 mr-2\" /> New declaration
        </Button>
      </div>

      {loading ? (
        <div className=\"text-neutral-500\" data-testid=\"dashboard-loading\">Loading…</div>
      ) : items.length === 0 ? (
        <Card className=\"rounded-sm border-dashed border-2 border-neutral-300 bg-white p-16 text-center\" data-testid=\"empty-state\">
          <FileText className=\"w-10 h-10 mx-auto text-neutral-400 mb-4\" strokeWidth={1} />
          <div className=\"font-serif-display text-2xl mb-2\">Your archive is empty</div>
          <p className=\"text-neutral-500 mb-6 max-w-md mx-auto text-sm\">
            Begin a new statutory declaration. Choose from 19 declaration profiles, attach
            exhibits, and export to court-grade PDF.
          </p>
          <Button onClick={() => navigate(\"/editor\")} className=\"rounded-sm bg-black hover:bg-neutral-800\" data-testid=\"empty-new-button\">
            <Plus className=\"w-4 h-4 mr-2\" /> Draft your first declaration
          </Button>
        </Card>
      ) : (
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5\" data-testid=\"declarations-grid\">
          {items.map((d) => (
            <Card
              key={d.id}
              className=\"rounded-sm border border-neutral-200 bg-white p-6 hover:shadow-md transition-shadow group\"
              data-testid={`declaration-card-${d.id}`}
            >
              <div className=\"flex items-start justify-between mb-4\">
                <div className=\"text-[10px] uppercase tracking-[0.2em] text-neutral-500\">
                  {getTypeLabel(d.template_id).split(\":\")[0]}
                </div>
                <div className=\"flex items-center gap-1.5\">
                  <button
                    onClick={() => navigate(`/editor/${d.id}`)}
                    className=\"p-1.5 hover:bg-neutral-100 rounded-sm transition-colors\"
                    aria-label=\"Edit\"
                    data-testid={`edit-${d.id}`}
                  >
                    <Pencil className=\"w-3.5 h-3.5 text-neutral-600\" />
                  </button>
                  <button
                    onClick={() => setPendingDelete(d)}
                    className=\"p-1.5 hover:bg-red-50 rounded-sm transition-colors\"
                    aria-label=\"Delete\"
                    data-testid={`delete-${d.id}`}
                  >
                    <Trash2 className=\"w-3.5 h-3.5 text-neutral-600 hover:text-red-600\" />
                  </button>
                </div>
              </div>
              <Link to={`/editor/${d.id}`}>
                <h3 className=\"font-serif-display text-xl leading-snug mb-2 group-hover:underline underline-offset-4 decoration-1\">
                  {d.title || getTypeLabel(d.template_id).split(\":\")[1]?.trim() || \"Untitled declaration\"}
                </h3>
              </Link>
              <p className=\"text-sm text-neutral-600 mb-4 line-clamp-2\">
                Declarant: <span className=\"text-neutral-900\">{d.declarant_name}</span>
              </p>
              <div className=\"flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100\">
                <div className=\"flex items-center gap-1.5\">
                  <Calendar className=\"w-3 h-3\" />
                  {new Date(d.updated_at).toLocaleDateString(\"en-GB\", {
                    day: \"2-digit\",
                    month: \"short\",
                    year: \"numeric\",
                  })}
                </div>
                <div>
                  {(d.selected_exhibits || []).length} exhibit
                  {(d.selected_exhibits || []).length === 1 ? \"\" : \"s\"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent className=\"rounded-sm\">
          <AlertDialogHeader>
            <AlertDialogTitle className=\"font-serif-display\">Delete declaration?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. The declaration and its exhibit configuration will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=\"rounded-sm\" data-testid=\"cancel-delete\">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className=\"rounded-sm bg-red-600 hover:bg-red-700\"
              data-testid=\"confirm-delete\"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Dashboard.jsx
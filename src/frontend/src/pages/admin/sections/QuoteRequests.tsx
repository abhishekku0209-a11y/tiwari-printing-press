import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCheck, Mail, Phone, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type QuoteRequest, quoteStore } from "../../../store/adminStore";

export default function QuoteRequests() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  const load = useCallback(() => setQuotes(quoteStore.get()), []);
  useEffect(() => {
    load();
  }, [load]);

  const markRead = (id: string) => {
    quoteStore.markRead(id);
    load();
  };

  const deleteQuote = (id: string) => {
    quoteStore.delete(id);
    load();
  };

  const unread = quotes.filter((q) => !q.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Quote Requests</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {quotes.length} total · {unread} unread
          </p>
        </div>
        {unread > 0 && (
          <Badge className="bg-gold text-navy font-bold">{unread} New</Badge>
        )}
      </div>

      {quotes.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
          data-ocid="quotes.empty_state"
        >
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No quote requests yet</p>
          <p className="text-sm mt-1">
            Requests from the website form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q, i) => (
            <div
              key={q.id}
              data-ocid={`quotes.item.${i + 1}`}
              className={`bg-white rounded-xl border ${
                !q.read
                  ? "border-l-4 border-l-gold border-border shadow-card"
                  : "border-border"
              } p-5`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-bold text-navy text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {q.name}
                    </span>
                    {!q.read && (
                      <Badge className="bg-gold/20 text-gold-dark border-gold/30 text-xs">
                        Unread
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(q.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {q.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {q.email}
                    </span>
                  </div>
                  {q.notes && (
                    <p className="text-sm text-foreground bg-secondary rounded-lg px-3 py-2 mt-2">
                      {q.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!q.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markRead(q.id)}
                      data-ocid={`quotes.secondary_button.${i + 1}`}
                      className="border-gold text-gold hover:bg-gold/10 text-xs h-8"
                    >
                      <CheckCheck className="w-3.5 h-3.5 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteQuote(q.id)}
                    data-ocid={`quotes.delete_button.${i + 1}`}
                    className="border-red-200 text-red-500 hover:bg-red-50 text-xs h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

from langgraph.graph import StateGraph, END

from app.services.ai.langgraph_state import FinanceState

from app.services.ai.langgraph_tools import (
    tool_node,
    answer_node,
)

from app.services.ai.router_service import (
    route_question,
    greeting_tool,
    out_of_scope_tool,
)


def router_node(state: FinanceState):

    routing = route_question(
        state["question"]
    )

    # Greeting
    if "greeting" in routing["tools"]:

        return {

            **state,

            "tools": ["greeting"],

            "answer": greeting_tool(
                state["question"]
            )["answer"]

        }

    # Out of scope
    if "out_of_scope" in routing["tools"]:

        return {

            **state,

            "tools": ["out_of_scope"],

            "answer": out_of_scope_tool(
                state["question"]
            )["answer"]

        }

    return {

        **state,

        "tools": routing["tools"]

    }


# ----------------------------------------------------
# Conditional Routing
# ----------------------------------------------------

def should_continue(state: FinanceState):

    if state["tools"] == ["greeting"]:

        return "end"

    if state["tools"] == ["out_of_scope"]:

        return "end"

    return "tool"


# ----------------------------------------------------
# Build Graph
# ----------------------------------------------------

builder = StateGraph(
    FinanceState
)

builder.add_node(
    "router",
    router_node
)

builder.add_node(
    "tool",
    tool_node
)

builder.add_node(
    "answer",
    answer_node
)

builder.set_entry_point(
    "router"
)

builder.add_conditional_edges(
    "router",
    should_continue,
    {
        "tool": "tool",
        "end": END
    }
)

builder.add_edge(
    "tool",
    "answer"
)

builder.add_edge(
    "answer",
    END
)

finance_graph = builder.compile()
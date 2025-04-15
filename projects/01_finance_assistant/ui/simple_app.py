import streamlit as st

st.title("Simple Tab Test")

tab1, tab2, tab3, tab4, tab5 = st.tabs(["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"])

with tab1:
    st.header("Tab 1 Content")
    st.write("This is the content of tab 1.")

with tab2:
    st.header("Tab 2 Content")
    st.write("This is the content of tab 2.")

with tab3:
    st.header("Tab 3 Content")
    st.write("This is the content of tab 3.")

with tab4:
    st.header("Tab 4 Content")
    st.write("This is the content of tab 4.")
    st.file_uploader("Upload a file", type=["csv", "txt"])

with tab5:
    st.header("Tab 5 Content")
    st.write("This is the content of tab 5.")
    user_input = st.chat_input("Type something...")
    if user_input:
        st.chat_message("user").write(user_input)
        st.chat_message("assistant").write(f"You said: {user_input}")

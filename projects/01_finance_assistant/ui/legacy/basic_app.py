import streamlit as st

st.set_page_config(
    page_title="Finance Assistant Basic",
    layout="wide",
)

st.title("Finance Assistant Basic")

# Create tabs
tabs = st.tabs(["Upload Data", "Chat Assistant"])

# Upload Data Tab
with tabs[0]:
    st.header("Upload Bank Statement")
    st.write("Upload your bank statement CSV file here.")
    
    # File uploader
    uploaded_file = st.file_uploader("Choose a CSV file", type="csv")
    
    if uploaded_file is not None:
        st.success("File uploaded successfully!")
        st.write("File name:", uploaded_file.name)
    else:
        st.info("Please upload a CSV file.")

# Chat Assistant Tab
with tabs[1]:
    st.header("Chat with Finance Assistant")
    st.write("Ask me anything about your finances.")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])
    
    # Chat input
    prompt = st.chat_input("Ask a question...")
    
    if prompt:
        # Add user message to chat
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.write(prompt)
        
        # Generate and display assistant response
        response = f"You asked: {prompt}\n\nThis is a simple response from the Finance Assistant."
        
        # Add assistant response to chat
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Display assistant response
        with st.chat_message("assistant"):
            st.write(response)

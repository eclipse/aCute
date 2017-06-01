package org.eclipse.acute.SWTBotTests.dotnetnew;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.NullProgressMonitor;
import org.eclipse.core.runtime.Path;
import org.eclipse.swtbot.eclipse.finder.SWTWorkbenchBot;
import org.eclipse.swtbot.eclipse.finder.waits.Conditions;
import org.eclipse.swtbot.swt.finder.exceptions.WidgetNotFoundException;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.eclipse.ui.IWorkingSet;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;

public class AbstractNewWizardTest {
	protected IProject project;
	protected static SWTWorkbenchBot bot;
	protected static String dotnetVersion;
	
	@Before
	public void setUp() throws Exception {
		this.project = ResourcesPlugin.getWorkspace().getRoot().getProject(getClass().getName() + System.currentTimeMillis());
		this.project.create(new NullProgressMonitor());
		this.project.open(new NullProgressMonitor());
		bot = new SWTWorkbenchBot();
	}
	
	@BeforeClass
	public static void beforeClass() {
		bot = new SWTWorkbenchBot();
		dotnetVersion = getDotNetVersion();
		try {
			bot.viewByTitle("Welcome").close();
		} catch (WidgetNotFoundException e) {
			//Welcome widget already closed
		}
	}

	@After
	public void tearDown() throws CoreException {
		//ensure that the pre-set values will be used
		bot.viewByTitle("Outline").setFocus();
		if(this.project.exists()) {
			this.project.delete(true, new NullProgressMonitor());
		}
	}

	protected SWTBotShell openWizard() {
		bot.menu("File").menu("New").menu("Other...").click();
		 
		SWTBotShell shell = bot.shell("New");
		shell.activate();
		bot.tree().expandNode(".NET").select(".NET project");
		bot.button("Next >").click();

		while(!bot.list(0).itemAt(0).equals("No available templates") && !bot.list(0).isEnabled()) {
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		return shell;
	}
	
	protected IProject checkProjectCreate(SWTBotShell shell, IWorkingSet[] workingSets) {
		IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
		
		String pathToFolder = bot.textWithLabel("Location").getText();
		String projectName = bot.textWithLabel("Project name").getText();
		Boolean isTemplateSelected = bot.list(0).selectionCount() != 0;
		
		IContainer container = root.getContainerForLocation(new Path(pathToFolder));
		int beforeFileCount = 0;
		if(container != null) {
			try {
				beforeFileCount = container.members().length;
			} catch (CoreException e) {
				fail("Unable to get containing folder content");
			}
		}
		bot.button("Finish").click();
		bot.waitUntil(Conditions.shellCloses(shell),15000);
		
		IProject createdProject = root.getProject(projectName);
		assertTrue("No .project file", createdProject.getFile(".project") != null);
		
		
		
		try {
			// Newer versions (>=2) of `dotnet new` require a template to generate extra files
			// Versions 1.1.* did not require a template to generate project files
			// Older versions (<1.1) did not have the dotnet run function
			if((isTemplateSelected && !dotnetVersion.isEmpty() && Character.getNumericValue(dotnetVersion.charAt(0)) > 1) || dotnetVersion.matches("^1\\.1.*")) {
				assertTrue("No files created with wizard", createdProject.members().length > beforeFileCount + 1);
			}
		} catch (CoreException e) {
			fail("Unable to get project folder content");
		}
		
		if(workingSets != null) {
			for (IWorkingSet iWorkingSet : workingSets) {
				assertTrue("Project not part of Working Set " + iWorkingSet.getName(),
						Arrays.asList(iWorkingSet.getElements()).contains(createdProject));
			}
		}
		
		return createdProject;
	}
	
	private static String getDotNetVersion() {
		String listCommand = "dotnet --version";

		Runtime runtime = Runtime.getRuntime();
		Process process;
		try {
			process = runtime.exec(listCommand);
			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String version = in.readLine();
				if (!version.isEmpty() && version.matches("^\\d\\.\\d\\.\\d.*")) {
					return version;
				} else {
					return "";
				}
			}
		} catch (IOException e1) {
			return "";
		}
	}
}
